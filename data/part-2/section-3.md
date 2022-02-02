---
path: "/part-2/3-volumes-in-action"
title: "Volumes in action"
hidden: false
---

Next we're going to set up [Redmine](https://www.redmine.org/), a PostgreSQL database and [Adminer](https://www.adminer.org/). All of them have official docker images available as we can see from [Redmine](https://hub.docker.com/_/redmine), [Postgres](https://hub.docker.com/_/postgres) and [Adminer](https://hub.docker.com/_/adminer) respectively. The officiality of the containers is not that important, just that we can expect that it will have some support. We could also, for example, setup Wordpress or a MediaWiki inside containers in the same manner if you're interested in running existing applications inside docker. You could even set up your own personal [Sentry](https://hub.docker.com/_/sentry/).

In <https://hub.docker.com/_/redmine> there is a list of different variants in `Supported tags and respective Dockerfile links` - most likely for this testing we can use any of the images. From "Environment Variables" we can see that all variants can use `REDMINE_DB_POSTGRES` or `REDMINE_DB_MYSQL` environment variables to set up the database, or it will fallback to SQLite. So before moving forward, let's setup postgres.

In <https://hub.docker.com/_/postgres> there's a sample compose file under "via docker stack deploy or docker-compose" - Let's strip that down to

```yaml
version: "3.8"

services:
  db:
    image: postgres:13.2-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
```

Note:

- `restart: always` was changed to `unless-stopped` that will keep the container running unless it's stopped. With `always` the stopped container is started after reboot for example.

Under "Caveats - Where to Store Data" we can see that the `/var/lib/postgresql/data` can be mounted separately to preserve data in an easy-to-locate directory or let Docker manage the storage. We could use a bind mount like previously, but let's first see what the "let Docker manage the storage" means. Let's run the docker-compose file without setting anything new:

```console
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

The image initializes the data files in the first start. Let's terminate the container with ^C. Compose uses the current directory as a prefix for container and volume names so that different projects don't clash. The prefix can be overridden with `COMPOSE_PROJECT_NAME` environment variable if needed.

Let's **inspect** if there was a volume created with `docker container inspect db_redmine | grep -A 5 Mounts`

```json
"Mounts": [
    {
        "Type": "volume",
        "Name": "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df",
        "Source": "/var/lib/docker/volumes/794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df/_data",
        "Destination": "/var/lib/postgresql/data",
```

Now if we check out `docker volume ls` we can see that a volume with name "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df" exists.

```console
$ docker volume ls
  DRIVER              VOLUME NAME
  local               794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df
```

There may be more volumes on your machine. If you want to get rid of them you can use `docker volume prune`. Let's put the whole "application" down now with `docker-compose down`. Then, this time let's create a separate volume for the data.

```yaml
version: "3.8"

services:
  db:
    image: postgres:13.2-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
    volumes:
      - database:/var/lib/postgresql/data

volumes:
  database:
```

```console
$ docker volume ls
  DRIVER              VOLUME NAME
  local               redmine_database

$ docker container inspect db_redmine | grep -A 5 Mounts
"Mounts": [
    {
        "Type": "volume",
        "Name": "redmine_database",
        "Source": "/var/lib/docker/volumes/ongoing_redminedata/_data",
        "Destination": "/var/lib/postgresql/data",
```

Ok, looks a bit more human readable even if it isn't more accessible than bind mounts. Now when the Postgres is running, let's add the [redmine](https://hub.docker.com/_/redmine). The container seems to require just two environment variables.

```yaml
redmine:
  image: redmine:4.1-alpine
  environment:
    - REDMINE_DB_POSTGRES=db
    - REDMINE_DB_PASSWORD=example
  ports:
    - 9999:3000
  depends_on:
    - db
```

Notice the `depends_on` declaration. This makes sure that the that `db` service should be started first. `depends_on` does not guarantee that the database is up, just that the service is started first. The Postgres server is accessible with dns name "db" from the redmine service as discussed in the "docker networking" section

Now when you run `docker-compose up` you will see a bunch of database migrations running first.

```console
  redmine_1  | I, [2019-03-03T10:59:20.956936 #25]  INFO -- : Migrating to Setup (1)
  redmine_1  | == 1 Setup: migrating =========================================================
  ...
  redmine_1  | [2019-03-03 11:01:10] INFO  ruby 2.6.1 (2019-01-30) [x86_64-linux]
  redmine_1  | [2019-03-03 11:01:10] INFO  WEBrick::HTTPServer#start: pid=1 port=3000
```

We can see that image also creates files to `/usr/src/redmine/files` that also need to be persisted. The Dockerfile has this [line](https://github.com/docker-library/redmine/blob/cea16044e97567c28802fc8cc06f6cd036c49a5c/4.0/Dockerfile#L155) where it declares that a volume should be created. Again docker will create the volume, but it will be handled as an anonymous volume that is not managed by compose, so it's better to be explicit about the volume. With that in mind our final file should look like this:

```yaml
version: "3.8"

services:
  db:
    image: postgres:13.2-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: example
    container_name: db_redmine
    volumes:
      - database:/var/lib/postgresql/data
  redmine:
    image: redmine:4.1-alpine
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

```console
$ docker container diff $(docker-compose ps -q redmine)
  C /usr/src/redmine/config/environment.rb
  ...
  C /usr/src/redmine/tmp/pdf
```

Probably not.

Next, we will add adminer to the application. We could also just use psql to interact with a postgres database with `docker container exec -it db_redmine psql -U postgres`. (The command **exec**utes psql -U postgres inside the container) The same method can be used to create backups with pg_dump: `docker container exec db_redmine pg_dump -U postgres > redmine.dump`.

This step is straightforward, we actually had the instructions open back before we set up postgres. But let's check the [documentation](https://hub.docker.com/_/adminer) and we see that the following will suffice:

```yaml
adminer:
  image: adminer:4
  restart: always
  environment:
    - ADMINER_DESIGN=galkaev
  ports:
    - 8083:8080
```

Now when we run the application we can access adminer from <http://localhost:8083>. Setting up adminer is straightforward since it will be able to access the database through docker network.

<exercise name="Exercise 2.6">

Add database to example backend.

Lets use a postgres database to save messages. We won't need to configure a volume since the official postgres image
sets a default volume for us. Lets use the postgres image documentation to our advantage when configuring:
[https://hub.docker.com/\_/postgres/](https://hub.docker.com/_/postgres/). Especially part Environment Variables is of
interest.

The backend [README](https://github.com/docker-hy/material-applications/tree/main/example-backend) should have all the information needed to
connect.

The button won't turn green but you can send messages to yourself.

Submit the docker-compose.yml

*  TIP: When configuring the database, you might need to destroy the automatically created volumes. Use command `docker volume prune`, `docker volume ls` and `docker volume rm` to remove unused volumes when testing. Make sure to remove containers that depend on them beforehand.

* `restart: unless-stopped` can help if the postgres takes a while to get ready

<img src="../img/exercises/back-front-redis-and-database.png" />

</exercise>

<exercise name="Exercise 2.7">

Configure a [machine learning](https://en.wikipedia.org/wiki/Machine_learning) project.

Look into machine learning project created with Python and React and split into three parts:
[frontend](https://github.com/docker-hy/ml-kurkkumopo-frontend),
[backend](https://github.com/docker-hy/ml-kurkkumopo-backend) and
[training](https://github.com/docker-hy/ml-kurkkumopo-training)

Note that the training requires 2 volumes and backend should share volume `/src/model` with training.

The frontend will display on http://localhost:3000 and the application will tell if the subject of an image looks more
like a cucumber or a moped.

Submit the docker-compose.yml

* This exercise is known to have broken for some attendees based on CPU. The error looks something like "Illegal instruction (core dumped)". Try downgrading / upgrading the tensorflow found in requirements.txt or join the Discord channel and message with Jakousa#1337.

* Note that the generated model is a toy and will not produce good results.

* It will take SEVERAL minutes to build the docker images, download training pictures and train the classifying model.

This exercise was created by [Sasu Mäkinen](https://github.com/sasumaki)

</exercise>

<exercise name="Exercise 2.8">

Add [nginx](https://hub.docker.com/_/nginx) to example frontend + backend.

<img src="../img/exercises/back-front-redis-database-and-nginx.png" />

Accessing your service from arbitrary port is counter intuitive since browsers use 80 (http) and 443 (https) by
default. And having the service refer to two origins in a case where there's only one backend isn't desirable either. We will skip the SSL setup for https/443.

Nginx will function as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) for us (see the image above).
The requests arriving at anything other than /api will be redirected to frontend container and /api will get
redirected to backend container.

At the end you should see that the frontend is accessible simply by going to http://localhost and the button works.
Other buttons may have stopped working, do not worry about them.

As we will not start configuring reverse proxies on this course you can have a simple config file:

The following file should be set to /etc/nginx/nginx.conf inside the nginx container. You can use a file volume where
the contents of the file are the following:

```
events { worker_connections 1024; }

http {
  server {
    listen 80;

    location / {
      proxy_pass _frontend-connection-url_;
    }

    location /api/ {
      proxy_set_header Host $host;
      proxy_pass _backend-connection-url_;
    }
  }
}
```

Nginx, backend and frontend should be connected in the same network. See the image above for how the services are connected.

Submit the docker-compose.yml


<text-box name="Tips for making sure the backend connection works" variant="hint">

Try using your browser to access http://localhost/api/ping and see if it answers pong

It might be nginx configuration problem: Add trailing `/` to the backend url in the nginx.conf.

</text-box>

</exercise>

<exercise name="Exercise 2.9">

Postgres image uses a volume by default. Manually define volumes for the database in convenient location such as in
`./database` . Use the image documentations (postgres) to help you with the task. You may do the same for redis as
well.

After you have configured the volume:

- Save a few messages through the frontend
- Run `docker-compose down`
- Run `docker-compose up` and see that the messages are available after refreshing browser
- Run `docker-compose down` and delete the volume folder manually
- Run `docker-compose up` and the data should be gone

Maybe it would be simpler to back them up now that you know where they are.

> TIP: To save you the trouble of testing all of those steps, just look into the folder before trying the steps. If
> it's empty after docker-compose up then something is wrong.

> TIP: Since you may have broken the buttons in nginx exercise you should test with a version of docker-compose.yml that doesn't break the buttons

Submit the docker-compose.yml

</exercise>

<exercise name="Exercise 2.10">

Some buttons may have stopped working in the frontend + backend project. Make sure that every button for exercises
works.

This may need a peek into the browsers developer consoles again like back part 1. The buttons of nginx exercise and
the first button behave differently but you want them to match.

If you had to do any changes explain what you had to change.

Submit the docker-compose yml and both dockerfiles.

</exercise>
