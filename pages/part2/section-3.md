
# Larger application with volumes #

Next we're going to set up [Redmine](https://www.redmine.org/), a PostgreSQL database and [Adminer](https://www.adminer.org/). All of them have official docker images available as we can see from [Redmine](https://hub.docker.com/_/redmine), [Postgres](https://hub.docker.com/_/postgres) and [Adminer](https://hub.docker.com/_/adminer) respectively. The officiality of the containers is not that important, just that we can expect that it will have some support. We could also, for example, setup Wordpress or a MediaWiki inside containers in the same manner if you're interested in running existing applications inside docker. You could even set up your own personal [Sentry](https://hub.docker.com/_/sentry/).

In <https://hub.docker.com/_/redmine> there is a list of different variants in `Supported tags and respective Dockerfile links` - most likely for this testing we can use any of the images. From "Environment Variables" we can see that all variants can use `REDMINE_DB_POSTGRES` or `REDMINE_DB_MYSQL` environment variables to set up the database, or it will fallback to SQLite. So before moving forward, let's setup postgres.

In <https://hub.docker.com/_/postgres> there's a sample compose file under "via docker stack deploy or docker-compose" - Let's strip that down to 

```yaml
version: '3.5' 

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
version: '3.5'

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
version: '3.5'

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

{% include_relative exercises/2_6.html %}
{% include_relative exercises/2_7.html %}
{% include_relative exercises/2_8.html %}
{% include_relative exercises/2_9.html %}
{% include_relative exercises/2_10.html %}