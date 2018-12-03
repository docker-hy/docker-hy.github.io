---
layout: page
title: part 2
inheader: yes
permalink: /part2/
order: 0
---

# docker-compose 

Even with a simple image, we've already been dealing with plenty of command line options in both building, pushing and running the image.
 
Now we'll switch to tool called docker-compose to manage these. 

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

The version setting is not very strict, it just needs to be above 2 because otherwise the syntax is significantly different. See https://docs.docker.com/compose/compose-file/ for more info. The key `build:` value can be set to a path (ubuntu) or have an object with `context` and `dockerfile` keys. 

Now we can build and push both variants with just these commands: 

    $ docker-compose build
    $ docker-compose push

To run the image as we did previously, we'll need to add the volume bind mounts. Compose can work without an absolute path: 

``` 
version: '3.5' 

services: 

    youtube-dl-ubuntu: 
      image: <username>/<repositoryname> 
      build: . 
      volumes: 
        - .:/mydir
      container_name: youtube-dl
```` 
We can also gave the container a name it will use when running with container_name, now we can run it: 

    $ docker-compose run youtube-dl-ubuntu https://www.youtube.com/watch?v=420UIn01VVc

### web services 

Compose is really meant for running web services, so let's move from simple binary wrappers to running a HTTP services. 

<https://github.com/jwilder/whoami> is simple service that prints the current container id (hostname). 

    $ docker run -d -p 8000:8000 jwilder/whoami 
      736ab83847bb12dddd8b09969433f3a02d64d5b0be48f7a5c59a594e3a6a3541 

Open browser or curl localhost:8000 will answer with the id. 

Take down the container so that it's not blocking port 8000 

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

Do exercise 2.1

#### Scaling

Compose can scale the service to run multiple instances: 

    $ docker-compose up --scale whoami=3 

      WARNING: The "whoami" service specifies a port on the host. If multiple containers for this service are created on a single host, the port will clash. 

      Starting whoami_whoami_1 ... done 
      Creating whoami_whoami_2 ... error 
      Creating whoami_whoami_3 ... error 

But it will fail with port clash. If we don't specify the host port, a free port will be allocated: 


    $ docker-compose port --index 1 whoami 8000 
      0.0.0.0:32770 

    $ docker-compose port --index 2 whoami 8000 
      0.0.0.0:32769 

    $ docker-compose port --index 3 whoami 8000 
      0.0.0.0:32768 

We can curl from these ports: 

    $ curl 0.0.0.0:32769 
      I'm 536e11304357 

    $ curl 0.0.0.0:32768 
      I'm 1ae20cd990f7 

In a server environment you'd often have a load balancer in-front of the service. For local environment (or a single server) one good solution is to use https://github.com/jwilder/nginx-proxy that configures nginx from docker daemon as containers are started and stopped.  

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

It's "working", but the nginx just doesn't know which service we want. The `nginx-proxy` works with two environment variables: `VIRTUAL_HOST` and `VIRTUAL_PORT`. `VIRTUAL_PORT` is not needed if the service has `EXPOSE` in it's docker image. We can see that `jwilder/whoami` sets it: https://github.com/jwilder/whoami/blob/master/Dockerfile#L9 

The domain `localtest.me` is configured so that all subdomains point to `127.0.0.1`  - let's use that: 

``` 
version: '3.5' 

services: 
    whoami: 
      image: jwilder/whoami 
      environment: 
       - VIRTUAL_HOST=whoami.localtest.me 
    proxy: 
      image: jwilder/nginx-proxy 
      volumes: 
        - /var/run/docker.sock:/tmp/docker.sock:ro 
      ports: 
        - 80:80 
``` 

Now the proxy works: 

    $ docker-compose up -d --scale whoami=3 
    $ curl whoami.localtest.me 
      I'm f6f85f4848a8 
    $ curl whoami.localtest.me 
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
        - VIRTUAL_HOST=hello.localtest.me 
    world: 
      image: nginx 
      volumes: 
        - ./world.html:/usr/share/nginx/html/index.html:ro 
      environment: 
        - VIRTUAL_HOST=world.localtest.me 
``` 

Now let's test: 

    $ docker-compose up -d --scale whoami=3 
    $ curl hello.localtest.me 
      hello 

    $ curl world.localtest.me 
      world 

    $ curl whoami.localtest.me 
      I'm f6f85f4848a8 

    $ curl whoami.localtest.me 
      I'm 740dc0de1954 

Now we have a basic single machine hosting setup up and running. 

Test updating the `hello.html` without restarting the container, does it work? 

# docker networking 

Connecting two services such as a server and its database in docker can be achieved with docker-compose networks. In addition to starting services listed in docker-compose.yml the tool automatically creates and joins both containers into a network where the service name is the hostname. This way containers can reference each other simply with their names.

For example services defined as `backend-server` that users access can connect to port 2345 of container `database` by connecting to database:2345 if they're both defined as service in the same docker-compose.yml. For this use case there is no need to publish the database port to host machine. This way the ports are only published to other containers in the docker network.

Do exercises 2.2 and 2.3

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

# volumes 

Next we'll setup Wordpress that requires MySQL and persisted volume. 
 
In https://hub.docker.com/_/wordpress/ there is a massive list of different variants in `Supported tags and respective Dockerfile links` - most likely for this testing we can use any of the images. From "How to use this image" we can see that all variants require `WORDPRESS_DB_HOST` that needs to be MySQL.So before moving forward, let's setup that. 

In https://hub.docker.com/_/mysql/ there's a sample compose file under "via docker stack deploy or docker-compose" - Let's strip that down to 


``` 

version: '3.5' 

services: 
    db: 
      image: mysql 
      restart: unless-stopped 
      environment: 
        MYSQL_ROOT_PASSWORD: example 
``` 

Notes: 

 - `restart: always` was changed to `unless-stopped` that will keep the container running unless it's stopped. With `always` the a stopped container is started after reboot for example. 

Under "Caveats - Where to Store Data" we can see that the `/var/lib/mysql` needs to be mounted separately to preserve data so that the container can be recreated. We could use a bind mount like previously, but this time let's create a separete **volume** for the data: 


``` 
version: '3.5' 

services: 
    mysql: 
      image: mysql
      restart: unless-stopped 
      environment: 
        - MYSQL_ROOT_PASSWORD=example 
      volumes: 
        - mysql-data:/var/lib/mysql 

volumes: 
    mysql-data: 
``` 

    $ docker-compose up 
      Creating network "wordpress_default" with the default driver 
      Creating volume "wordpress_mysql-data" with default driver 
      Creating wordpress_mysql_1 ... 
      Creating wordpress_mysql_1 ... done 
      Attaching to wordpress_mysql_1 
      mysql_1  | Initializing database 
      ... 
      mysql_1  | 2018-02-01T19:48:20.660859Z 0 [Warning] 'tables_priv' entry 'sys_config mysql.sys@localhost' ignored in --skip-name-resolve mode. 

      mysql_1  | 2018-02-01T19:48:20.664811Z 0 [Note] Event Scheduler: Loaded 0 events 

      mysql_1  | 2018-02-01T19:48:20.665236Z 0 [Note] mysqld: ready for connections. 

      mysql_1  | Version: '5.7.21'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL) 

The image initializes the data files in the first start. Let's terminate the container with ^C 

    ^CGracefully stopping... (press Ctrl+C again to force) 
    Stopping wordpress_mysql_1 ... done 

Compose uses the current directory as a prefix for container and volume names so that different projects don't clash. The prefix can be overriden with `COMPOSE_PROJECT_NAME` environment variable if needed. 

Now when the MySQL is running, let's add the actual Wordpress. The container seems to require just two environment variables. 

``` 
    wordpress: 
      image: 'wordpress:4.9.1-php7.1-apache' 
      environment: 
        - WORDPRESS_DB_HOST=mysql 
        - WORDPRESS_DB_PASSWORD=example 
      ports: 
        - '9999:80' 
      depends_on: 
        - mysql 
``` 

We also declare that `mysql` service should be started first and that the container will link to it - The MySQL server is accessible with dns name "mysql" from the Wordpress service. 

Now when you run it: 

    $ docker-compose up -d 
    $ docker-compose logs wordpress 
      Attaching to wordpress_wordpress_1 

      wordpress_1  | WordPress not found in /var/www/html - copying now... 

      wordpress_1  | Complete! WordPress has been successfully copied to /var/www/html 
      ... 

We see that Wordpress image creates files in startup at `/var/www/html` that also needs to be persisted. The Dockerfile has this line https://github.com/docker-library/wordpress/blob/6a085d90853b8baffadbd3f0a41d6814a2513c11/php7.1/apache/Dockerfile#L44 where it declares that a volume should be created. Docker will create the volume, but it will be handled as a anonymous volume that is not managed by compose, so it's better to be explicit about the volume. With that in mind our final file should look like this: 

``` 
version: '3.5' 

services: 
    mysql: 
      image: mysql 
      restart: unless-stopped 
      environment: 
        - MYSQL_ROOT_PASSWORD=example 
      volumes: 
        - mysql-data:/var/lib/mysql 
    wordpress: 
      image: 'wordpress:4.9.1-php7.1-apache' 
      environment: 
        - WORDPRESS_DB_HOST=mysql 
        - WORDPRESS_DB_PASSWORD=example 
      volumes: 
        - wordpress-data:/var/www/html 
      ports: 
        - '9999:80' 
      depends_on: 
        - mysql 
volumes: 
    mysql-data: 
    wordpress-data: 
``` 

Now open and configure the installation at http://localhost:9999 

We can inspect the changes that happened in the image and ensure that no extra meaningful files got written to the container: 
 
    $ docker diff $(docker-compose ps -q wordpress) 
    C /run/apache2 
    A /run/apache2/apache2.pid 
    C /run/lock/apache2 
    C /tmp 

Since plugins and image uploads will by default write to local disk at `/var/www/html`, this means that Wordpress can not be scaled in a real production deployment on multiple machines without somehow sharing this path. Some possible solutions: 

    - shared filesystem like NFS or AWS EFS 

    - Something like https://www.gluster.org/ or http://ceph.com/ 

    - Two-way syncing daemon like https://www.cis.upenn.edu/~bcpierce/unison/index.html, https://syncthing.net/ or https://www.resilio.com) - see http://blog.kontena.io/how-to-build-high-availability-wordpress-site-with-docker/ 

    - User space FUSE solutions like https://github.com/kahing/goofys or https://github.com/googlecloudplatform/gcsfuse 

    - See https://lemag.sfeir.com/wordpress-cluster-docker-google-cloud-platform/ 

### Backups and restore 

We can test backing up: 

    $ docker-compose exec mysql mysqldump wordpress -uroot -pexample | less 

Where we see that the first line is unexpected: 

    mysqldump: [Warning] Using a password on the command line interface can be insecure. 

This is because docker-compose's exec has a bug https://github.com/docker/compose/issues/5207 where STDERR gets printed to STDOUT.. As a workaround we can skip `docker-compose` 

    $ docker exec -i $(docker-compose ps -q mysql) mysqldump wordpress -uroot -pexample > dump.sql 

      mysqldump: [Warning] Using a password on the command line interface can be insecure. 

Now STDERR is correctly printed to the terminal. 

    $ docker-compose down 
      Stopping wordpress_wordpress_1 ... done 
      Stopping wordpress_mysql_1     ... done 
      Removing wordpress_wordpress_1 ... done 
      Removing wordpress_mysql_1     ... done 
      Removing network wordpress_default 

As our volumes are managed separately in docker-compose, that command didn't remove our volumes to prevent mistakes. 

    $ docker-compose down --volumes 
      Removing network wordpress_default 
      WARNING: Network wordpress_default not found. 
      Removing volume wordpress_mysql-data 
      Removing volume wordpress_wordpress-data 

Then start the mysql service again (with fresh volumes) without the wordpress service 

    $ docker-compose up -d mysql 

Since the dumping with `docker-compose exec` did not work, let's see if importing would: 

    $ docker-compose exec mysql mysql -uroot -pexample < dump.sql 
      mysql: [Warning] Using a password on the command line interface can be insecure. 

      Traceback (most recent call last): 

        File "docker-compose", line 6, in <module> 
        File "compose/cli/main.py", line 71, in main 
        File "compose/cli/main.py", line 124, in perform_command 
        File "compose/cli/main.py", line 467, in exec_command 
        File "site-packages/dockerpty/pty.py", line 338, in start 
        File "site-packages/dockerpty/io.py", line 32, in set_blocking 

      ValueError: file descriptor cannot be a negative integer (-1) 

      Failed to execute script docker-compose 

...and no, because of another bug in https://github.com/docker/compose/issues/3352 - we'll bypass compose again with: 

    $ docker exec -i $(docker-compose ps -q mysql) mysql -uroot -pexample wordpress < dump.sql 

And then start the wordpress: 

    $ docker-compose up -d wordpress 

And our old site is back! 

Do exercises 2.4, 2.5 and 2.6