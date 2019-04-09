---
layout: page
title: Part 2
inheader: yes
permalink: /part2/
order: 0
---

# docker-compose 

Even with a simple image, we've already been dealing with plenty of command line options in both building, pushing and running the image.
 
Now we'll switch to a tool called docker-compose to manage these. 

docker-compose is designed to simplify running multi-container applications to using a single command.

### First docker-compose.yml

In the folder where we have our Dockerfile with the following content:

```
FROM ubuntu:16.04

WORKDIR /mydir

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl

ENV LC_ALL=C.UTF-8

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

we'll create a file called `docker-compose.yml`:

``` 
version: '3' 

services: 
    youtube-dl-ubuntu:  
      image: <username>/<repositoryname>
      build: . 

``` 

The version setting is not very strict, it just needs to be above 2 because otherwise the syntax is significantly different. See <https://docs.docker.com/compose/compose-file/> for more info. The key `build:` value can be set to a path (ubuntu), have an object with `context` and `dockerfile` keys or reference a `url of a git repository`.

Now we can build and push with just these commands: 

    $ docker-compose build
    $ docker-compose push

### Volumes in docker-compose ###

To run the image as we did previously, we'll need to add the volume bind mounts. Volumes in docker-compose are defined with the with the following syntax `location-in-host:location-in-container`. Compose can work without an absolute path:

``` 
version: '3.5' 

services: 

    youtube-dl-ubuntu: 
      image: <username>/<repositoryname> 
      build: . 
      volumes: 
        - .:/mydir
      container_name: youtube-dl
``` 

We can also give the container a name it will use when running with container_name, now we can run it: 

    $ docker-compose run youtube-dl-ubuntu https://www.youtube.com/watch?v=420UIn01VVc

**[Do exercise 2.1](/exercises/#21)**

### web services 

Compose is really meant for running web services, so let's move from simple binary wrappers to running a HTTP service. 

<https://github.com/jwilder/whoami> is a simple service that prints the current container id (hostname). 

    $ docker run -d -p 8000:8000 jwilder/whoami 
      736ab83847bb12dddd8b09969433f3a02d64d5b0be48f7a5c59a594e3a6a3541 

Navigate with a browser or curl to localhost:8000, they both will answer with the id. 

Take down the container so that it's not blocking port 8000.

    $ docker stop 736ab83847bb
    $ docker rm 736ab83847bb  

Let's create a new folder and a docker-compose file `whoami/docker-compose.yml` from the command line options.

``` 
version: '3.5'  

services: 
    whoami: 
      image: jwilder/whoami 
      ports: 
        - 8000:8000 
``` 

Test it: 

    $ docker-compose up -d 
    $ curl localhost:8000 


Environment variables can also be given to the containers in docker-compose.

```
version: '3.5'

services:
  backend:
      image:  
      environment:
        - VARIABLE=VALUE
        - VARIABLE 
```

**[Do exercises 2.2 and 2.3](/exercises/#22)**

#### Scaling

Compose can scale the service to run multiple instances: 

    $ docker-compose up --scale whoami=3 

      WARNING: The "whoami" service specifies a port on the host. If multiple containers for this service are created on a single host, the port will clash. 

      Starting whoami_whoami_1 ... done 
      Creating whoami_whoami_2 ... error 
      Creating whoami_whoami_3 ... error 

The command fails due to a port clash, as each instance will attempt to bind to the same host port (8000).

We can get around this by only specifying the container port. As mentioned in [part 1](/part1/#allowing-external-connections-into-containers), when leaving the host port unspecified, Docker will automatically choose a free port.

Update the ports definition in `docker-compose.yml`:

    ports: 
    - 8000

Then run the command again:

    $ docker-compose up --scale whoami=3
    Starting whoami_whoami_1 ... done
    Creating whoami_whoami_2 ... done
    Creating whoami_whoami_3 ... done

All three instances are now running and listening on random host ports. We can use `docker-compose port` to find out which ports the instances are bound to.

    $ docker-compose port --index 1 whoami 8000 
      0.0.0.0:32770 

    $ docker-compose port --index 2 whoami 8000 
      0.0.0.0:32769 

    $ docker-compose port --index 3 whoami 8000 
      0.0.0.0:32768 

We can now curl from these ports: 

    $ curl 0.0.0.0:32769 
      I'm 536e11304357 

    $ curl 0.0.0.0:32768 
      I'm 1ae20cd990f7 

In a server environment you'd often have a load balancer in-front of the service. For local environment (or a single server) one good solution is to use <https://github.com/jwilder/nginx-proxy> that configures nginx from docker daemon as containers are started and stopped.  

Let's add the proxy to our compose file and remove the port bindings from the whoami service. We'll mount our `docker.sock` inside of the container in `:ro` read-only mode. 

``` 
version: '3.5' 

services: 
    whoami: 
      image: jwilder/whoami 
    proxy: 
      image: jwilder/nginx-proxy 
      volumes: 
        - /var/run/docker.sock:/tmp/docker.sock:ro 
      ports: 
        - 80:80 
``` 

When we start this and test 

    $ docker-compose up -d --scale whoami=3 
    $ curl localhost:80 
      <html> 
      <head><title>503 Service Temporarily Unavailable</title></head> 
      <body bgcolor="white"> 
      <center><h1>503 Service Temporarily Unavailable</h1></center> 
      <hr><center>nginx/1.13.8</center> 
      </body> 
      </html> 

It's "working", but the nginx just doesn't know which service we want. The `nginx-proxy` works with two environment variables: `VIRTUAL_HOST` and `VIRTUAL_PORT`. `VIRTUAL_PORT` is not needed if the service has `EXPOSE` in it's docker image. We can see that `jwilder/whoami` sets it: <https://github.com/jwilder/whoami/blob/master/Dockerfile#L9>

The domain `colasloth.com` is configured so that all subdomains point to `127.0.0.1`. More information about how this works can be found at [colasloth.github.io](https://colasloth.github.io), but in brief it's a simple DNS "hack". Several other domains serving the same purpose exist, such as `localtest.me`, `lvh.me`, and `vcap.me`, to name a few. In any case, let's use `colasloth.com` here:

``` 
version: '3.5' 

services: 
    whoami: 
      image: jwilder/whoami 
      environment: 
       - VIRTUAL_HOST=whoami.colasloth.com 
    proxy: 
      image: jwilder/nginx-proxy 
      volumes: 
        - /var/run/docker.sock:/tmp/docker.sock:ro 
      ports: 
        - 80:80 
``` 

Now the proxy works: 

    $ docker-compose up -d --scale whoami=3 
    $ curl whoami.colasloth.com 
      I'm f6f85f4848a8 
    $ curl whoami.colasloth.com 
      I'm 740dc0de1954 

Let's add couple of more containers behind the same proxy. We can use the official `nginx` image to serve a simple static web page. We don't have to even build the container images, we can just mount the content to the image. Let's prepare some content for two services called "hello" and "world". 

    $ echo "hello" > hello.html 
    $ echo "world" > world.html 

Then add these services to the `docker-compose.yml` file where you mount just the content as `index.html` in the default nginx path: 

``` 
    hello: 
      image: nginx 
      volumes: 
        - ./hello.html:/usr/share/nginx/html/index.html:ro 
      environment: 
        - VIRTUAL_HOST=hello.colasloth.com 
    world: 
      image: nginx 
      volumes: 
        - ./world.html:/usr/share/nginx/html/index.html:ro 
      environment: 
        - VIRTUAL_HOST=world.colasloth.com 
``` 

Now let's test: 

    $ docker-compose up -d --scale whoami=3 
    $ curl hello.colasloth.com 
      hello 

    $ curl world.colasloth.com 
      world 

    $ curl whoami.colasloth.com 
      I'm f6f85f4848a8 

    $ curl whoami.colasloth.com 
      I'm 740dc0de1954 

Now we have a basic single machine hosting setup up and running. 

Test updating the `hello.html` without restarting the container, does it work? 

# docker networking 

Connecting two services such as a server and its database in docker can be achieved with docker-compose networks. In addition to starting services listed in docker-compose.yml the tool automatically creates and joins both containers into a network where the service name is the hostname. This way containers can reference each other simply with their names.

For example services defined as `backend-server` that users access can connect to port 2345 of container `database` by connecting to database:2345 if they're both defined as service in the same docker-compose.yml. For this use case there is no need to publish the database port to host machine. This way the ports are only published to other containers in the docker network.

**[Do exercises 2.4](/exercises/#24)**

You can also manually define the network and also its name in docker-compose version 3.5 forward. A major benefit of defining network is that it makes it easy to setup a configuration where other containers connect to an existing network as an external network.

Defining  docker-compose.yml
```
networks:
  database-network:
    name: server-database-network
```

To connect containers in another docker-compose.yml
```
networks:
  default:
    external:
      name: server-database-network
```

### Larger application with volumes ###

Next we're going to set up [Redmine](https://www.redmine.org/), a PostgreSQL database and [Adminer](https://www.adminer.org/). All of them have official docker images available as we can see from [Redmine](https://hub.docker.com/_/redmine), [Postgres](https://hub.docker.com/_/postgres) and [Adminer](https://hub.docker.com/_/adminer) respectively. The officiality of the containers is not that important, just that we can expect that it will have some support. We could also, for example, setup wordpress or a mediawiki inside containers in the same manner if you're interested in running existing applications inside docker. You could even set up your own personal [Sentry](https://hub.docker.com/_/sentry/).

In <https://hub.docker.com/_/redmine> there is a list of different variants in `Supported tags and respective Dockerfile links` - most likely for this testing we can use any of the images. From "Environment Variables" we can see that all variants can use `REDMINE_DB_POSTGRES` or `REDMINE_DB_MYSQL` environment variables to set up the database, or it will fallback to SQLite. So before moving forward, let's setup postgres.

In <https://hub.docker.com/_/postgres> there's a sample compose file under "via docker stack deploy or docker-compose" - Let's strip that down to 

``` 
version: '3.5' 

services:
  db:
    image: postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
``` 

Note: 

 - `restart: always` was changed to `unless-stopped` that will keep the container running unless it's stopped. With `always` the stopped container is started after reboot for example. 

Under "Caveats - Where to Store Data" we can see that the `/var/lib/postgresql/data` can be mounted separately to preserve data in an easy-to-locate directory or let Docker manage the storage. We could use a bind mount like previously, but let's first see what the "let Docker manage the storage" means. Let's run the docker-compose file without setting anything new:

```
$ docker-compose up 

Creating network "redmine_default" with the default driver
Creating db_redmine ... done
Attaching to db_redmine
db_redmine | The files belonging to this database system will be owned by user "postgres".
...
db_redmine | 2019-03-03 10:27:22.975 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_redmine | 2019-03-03 10:27:22.975 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_redmine | 2019-03-03 10:27:22.979 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_redmine | 2019-03-03 10:27:22.995 UTC [50] LOG:  database system was shut down at 2019-03-03 10:27:22 UTC
db_redmine | 2019-03-03 10:27:23.002 UTC [1] LOG:  database system is ready to accept connections
```

The image initializes the data files in the first start. Let's terminate the container with ^C. Compose uses the current directory as a prefix for container and volume names so that different projects don't clash. The prefix can be overriden with `COMPOSE_PROJECT_NAME` environment variable if needed. 

Let's **inspect** if there was a volume created with `docker inspect db_redmine | grep -A 5 Mounts`

```
"Mounts": [
    {
        "Type": "volume",
        "Name": "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df",
        "Source": "/var/lib/docker/volumes/794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df/_data",
        "Destination": "/var/lib/postgresql/data",
```

Now if we check out `docker volume ls` we can see that a volume with name "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df" exists.

```
$ docker volume ls
DRIVER              VOLUME NAME
local               794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df
```

There may be more volumes on your machine. If you want to get rid of them you can use `docker volume prune`. Let's put the whole "application" down now with `docker-compose down`. Then, this time let's create a separate volume for the data.

```
version: '3.5'

services:
  db:
    image: postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
    volumes:
      - database:/var/lib/postgresql/data

volumes:
  database:
```

```
$ docker volume ls
DRIVER              VOLUME NAME
local               redmine_database

$ ongoing docker inspect db_redmine | grep -A 5 Mounts
"Mounts": [
    {
        "Type": "volume",
        "Name": "redmine_database",
        "Source": "/var/lib/docker/volumes/ongoing_redminedata/_data",
        "Destination": "/var/lib/postgresql/data",
```

Ok, looks a bit more human readable even if it isn't more accessible than bind mounts. Now when the Postgres is running, let's add the [redmine](https://hub.docker.com/_/redmine). The container seems to require just two environment variables. 

``` 
redmine: 
  image: redmine
  environment: 
    - REDMINE_DB_POSTGRES=db
    - REDMINE_DB_PASSWORD=example
  ports: 
    - '9999:3000' 
  depends_on: 
    - db
``` 

Notice the `depends_on` declaration. This makes sure that the that `db` service should be started first. `depends_on` does not guarantee that the database is up, just that the service is started first. The Postgres server is accessible with dns name "db" from the redmine service as discussed in the "docker networking" section

Now when you run it you will see a bunch of database migrations running first.

```
redmine_1  | I, [2019-03-03T10:59:20.956936 #25]  INFO -- : Migrating to Setup (1)
redmine_1  | == 1 Setup: migrating =========================================================
...
redmine_1  | [2019-03-03 11:01:10] INFO  ruby 2.6.1 (2019-01-30) [x86_64-linux]
redmine_1  | [2019-03-03 11:01:10] INFO  WEBrick::HTTPServer#start: pid=1 port=3000
```

We can see that image also creates files to `/usr/src/redmine/files` that also need to be persisted. The Dockerfile has this [line](https://github.com/docker-library/redmine/blob/cea16044e97567c28802fc8cc06f6cd036c49a5c/4.0/Dockerfile#L15) where it declares that a volume should be created. Again docker will create the volume, but it will be handled as an anonymous volume that is not managed by compose, so it's better to be explicit about the volume. With that in mind our final file should look like this: 

``` 
version: '3.5'

services:
  db:
    image: postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
    volumes:
      - database:/var/lib/postgresql/data
  redmine:
    image: redmine
    environment:
      - REDMINE_DB_POSTGRES=db
      - REDMINE_DB_PASSWORD=example
    ports:
      - 9999:3000
    volumes:
      - files:/usr/src/redmine/files
    depends_on:
      - db

volumes:
  database:
  files:
``` 

Now we can use the application with our browser through <http://localhost:9999>. After some changes inside the application we can inspect the changes that happened in the image and check that no extra meaningful files got written to the container: 

```
$ docker diff $(docker-compose ps -q redmine) 
C /usr/src/redmine/config/environment.rb
...
C /usr/src/redmine/tmp/pdf
```

Probably not.

Next we'll add adminer to the application. We could also just use psql to interact with a postgres database with `docker exec -it db_redmine psql -U postgres`. (The command **exec**utes psql -U postgres inside the container) The same method can be used to create backups with pg_dump: `docker exec db_redmine pg_dump -U postgres > redmine.dump`. 

This step is straightforward, we actually had the instructions open back before we set up postgres. But let's check the [documentation](https://hub.docker.com/_/adminer) and we'll see that the following will suffice:

```
adminer:
  image: adminer
  restart: always
  environment:
    - ADMINER_DESIGN=galkaev
  ports:
    - 8083:8080
```

Now when we run the application we can access adminer from <http://localhost:8083>. Setting up adminer is straightforward since it will be able to access the database through docker network.

**[Do exercises 2.5 - 2.10](/exercises/#25)**

## Epilogue, or rather, a recap ##

Again we started from the ground up by learning how to translate non-compose setup into docker-compose.yml and ran with it. Compose gave us also a few handy completely new features that we didn't even know we needed, networks.

Now we've learned how to setup up vastly more complex applications with up to 5 different programs running at the same time and they only expose the used ports to the outside world (or even to our machine).

Are we ready for production yet? Short answer: no. Long answer: depends on the situation. Good thing we have [part 3](/part3/)
