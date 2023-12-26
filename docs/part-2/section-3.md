---
title: "Volumes in action"
---

Next we're going to set up the project management application [Redmine](https://www.redmine.org/), a PostgreSQL database and [Adminer](https://www.adminer.org/), a graphical interface for database administration.

All of above have official Docker images available as we can see from [Redmine](https://hub.docker.com/_/redmine), [Postgres](https://hub.docker.com/_/postgres) and [Adminer](https://hub.docker.com/_/adminer) respectively. The officiality of the containers is not that important, just that we can expect that it will have some support. We could also, for example, setup Wordpress or a MediaWiki inside containers in the same manner if you're interested in running existing applications inside Docker. You could even set up a application monitoring tool such as [Sentry](https://hub.docker.com/_/sentry/).

In <https://hub.docker.com/_/redmine> there is a list of different tagged versions:

![Redmine](/img/2/redmine.png)

We can most likely use any of the available images.

From section _Environment Variables_ we can see that all versions can use `REDMINE_DB_POSTGRES` environment variable to set up a Postgres database. So before moving forward, let's setup Postgres for us.

In <https://hub.docker.com/_/postgres> there's a sample compose file under "via Docker Stack deploy or Docker Compose" - Let's strip that down to

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

- `restart: always` was changed to `unless-stopped` that will keep the container running unless we explicitly stop it. With `always` the stopped container is started after reboot for example, see [here](https://docs.docker.com/config/containers/start-containers-automatically/) for more.

Under the section [Where to store data](https://github.com/docker-library/docs/blob/master/postgres/README.md#where-to-store-data) we can see that the `/var/lib/postgresql/data` should be mounted separately to preserve the data.

There are two options. We could use a bind mount like previously and mount a easy-to-locate directory for storing the data. Let us now use the other option, a [Docker managed volume](https://docs.docker.com/storage/volumes/).


Let's run the Docker Compose file without setting anything new:

```console
$ docker compose up

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

The image initializes the data files in the first start. Let's terminate the container with ^C. Compose uses the current directory as a prefix for container and volume names so that different projects don't clash (The prefix can be overridden with `COMPOSE_PROJECT_NAME` environment variable if needed).

Let's **inspect** if there was a volume created with `docker container inspect db_redmine | grep -A 5 Mounts`

```json
"Mounts": [
    {
        "Type": "volume",
        "Name": "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df",
        "Source": "/var/lib/docker/volumes/794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df/_data",
        "Destination": "/var/lib/postgresql/data",
```

An indeed there is one! So despite us not configuring one explicitly, an anonymous volume was automatically created for us.

Now if we check out `docker volume ls` we can see that a volume with name "794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df" exists.

```console
$ docker volume ls
  DRIVER              VOLUME NAME
  local               794c9d8db6b5e643865c8364bf3b807b4165291f02508404ff3309b8ffde01df
```

There may be more volumes on your machine. If you want to get rid of them you can use `docker volume prune`. Let's put the whole "application" down now with `docker compose down`.

Instead of the randomly named volume we better define one explicitly.
Let us change the definition as follows:

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

Now, after running `docker compose up` again, let us check what it looks like:

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

Ok, looks a bit more human readable! Now when the Postgres is running, it is time to add [Redmine](https://hub.docker.com/_/redmine).

The container seems to require just two environment variables.

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

Notice the [depends_on](https://docs.docker.com/compose/compose-file/compose-file-v3/#depends_on) declaration. This makes sure that the `db` service is started first. `depends_on` does not guarantee that the database is up, just that it is started first. The Postgres server is accessible with DNS name "db" from the Redmine service as discussed in the section [Docker networking](/part-2/section-2).

Now when you run `docker compose up` you will see a bunch of database migrations running first.

```console
  redmine_1  | I, [2019-03-03T10:59:20.956936 #25]  INFO -- : Migrating to Setup (1)
  redmine_1  | == 1 Setup: migrating =========================================================
  ...
  redmine_1  | [2019-03-03 11:01:10] INFO  ruby 2.6.1 (2019-01-30) [x86_64-linux]
  redmine_1  | [2019-03-03 11:01:10] INFO  WEBrick::HTTPServer#start: pid=1 port=3000
```

As the [documentation](https://hub.docker.com/_/redmine) mentions, the image creates files to `/usr/src/redmine/files` and those are better to be persisted. The Dockerfile has this [line](https://github.com/docker-library/redmine/blob/cea16044e97567c28802fc8cc06f6cd036c49a5c/4.0/Dockerfile#L155) where it declares that a volume should be created. Again Docker will create the volume, but it will be handled as an anonymous volume that is not managed by the Docker Compose, so it's better to create it explicitly.

With that in mind, our configuration changes to this:

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
$ docker container diff $(docker compose ps -q redmine)
  C /usr/src/redmine/config/environment.rb
  ...
  C /usr/src/redmine/tmp/pdf
```

Probably not.

We could  use psql to interact with the Postgres database by running  `docker container exec -it db_redmine psql -U postgres`. (The command **exec**utes psql -U postgres inside the container) The same method can be used to create backups with pg_dump: `docker container exec db_redmine pg_dump -U postgres > redmine.dump`.

Rather than using the archaic command line interface to access Postgres, let us now set up the database adminer to the application.

After a look at the [documentation](https://hub.docker.com/_/adminer),
the setup is straightforward:

```yaml
adminer:
  image: adminer:4
  restart: always
  environment:
    - ADMINER_DESIGN=galkaev
  ports:
    - 8083:8080
```

Now when we run the application we can access adminer from <http://localhost:8083>:

![Adminer view](/img/2/adminer.png)

Setting up the adminer is straightforward since it will be able to access the database through Docker network. You may wonder how adminer finds the Postgres database container? We provide this information to Redmine using an environment variable:

```yaml
  redmine:
    environment:
      - REDMINE_DB_POSTGRES=db
```

Adminer actually assumes that the database has DNS name  _db_ so with this name selection, we did not have to specify anything. If the database has some other name, we have to pass it to adminer using an environment variable:

```yaml
  adminer:
    environment:
      - ADMINER_DEFAULT_SERVER=database_server
```

## Exercises 2.6 - 2.10

:::info Exercise 2.6

Let us continue with the example app that we worked with in [Exercise 2.4](/part-2/section-2#exercise-24).

Now you should add a database to the example backend.

Use a Postgres database to save messages. For now there is no need to configure a volume since the official postgres image sets a default volume for us. Use the Postgres image documentation to your advantage when configuring: [https://hub.docker.com/\_/postgres/](https://hub.docker.com/_/postgres/). Especially part _Environment Variables_ is a valuable one.

The backend [README](https://github.com/docker-hy/material-applications/tree/main/example-backend) should have all the information needed to
connect.

There is again a button (and a form!) in the frontend that you can use to ensure your configuration is done right.

Submit the docker-compose.yml

*  TIP: When configuring the database, you might need to destroy the automatically created volumes. Use command `docker volume prune`, `docker volume ls` and `docker volume rm` to remove unused volumes when testing. Make sure to remove containers that depend on them beforehand.

* `restart: unless-stopped` can help if the Postgres takes a while to get ready

![Backend, frontend, redis and a database](/img/exercises/back-front-redis-and-database.png)

:::

:::info Exercise 2.7

Postgres image uses a volume by default. Define manually a volume for the database in a convenient location such as in `./database` so you should use now a [bind mount](https://docs.docker.com/storage/bind-mounts/). The image [documentation](https://github.com/docker-library/docs/blob/master/postgres/README.md#where-to-store-data) may help you with the task.

After you have configured the bind mount volume:

- Save a few messages through the frontend
- Run `docker compose down`
- Run `docker compose up` and see that the messages are available after refreshing browser
- Run `docker compose down` and delete the volume folder manually
- Run `docker compose up` and the data should be gone

> TIP: To save you the trouble of testing all of those steps, just look into the folder before trying the steps. If
> it's empty after `docker compose up` then something is wrong.

Submit the docker-compose.yml

The benefit of a bind mount is that since you now exactly where the data is in your file system, it is easy to create backups. If Docker managed volumes are used, the location of the data in the file system can not be controlled and that makes backups a bit less trivial...

:::

:::tip Tips for making sure the backend connection works

In the next exercise try using your browser to access http://localhost/api/ping and see if it answers pong

It might be Nginx configuration problem. Ensure there is a trailing / on the backend url as specified under the location /api/ context in the nginx.conf.

:::

:::info Exercise 2.8

Add [Nginx](https://hub.docker.com/_/nginx) to example to work as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) in front of the example app frontend and backend. According to Wikipedia

_A reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself._

![Backend, frontend, redis, a database and nginx](/img/exercises/back-front-redis-database-and-nginx.png)

So in our case, the reverse proxy will be the single point of entry to our application, and the final goal will be to set both the React frontend and the Express backend behind the reverse proxy.

The idea is that browser makes _all_ requests to _http://localhost_. If the request has a url prefix _http://localhost/api_, Nginx should forward the request to the backend container. All the other requests are directed the frontend container.

So, at the end you should see that the frontend is accessible simply by going to <http://localhost>. All buttons, except the one labelled _Exercise 2.8_ may have stopped working, do not worry about them, we shall fix that later.

The following file should be set to _/etc/nginx/nginx.conf_ inside the nginx container. You can use a file bind mount where the contents of the file is the following:

```bash
events { worker_connections 1024; }

http {
  server {
    listen 80;

    location / {
      proxy_pass _frontend-connection-url_;
    }

    # configure here where requests to http://localhost/api/...
    # are forwarded
    location /api/ {
      proxy_set_header Host $host;
      proxy_pass _backend-connection-url_;
    }
  }
}
```

Nginx, backend and frontend should be connected in the same network. See the image above for how the services are connected. You find [Nginx-documentation](https://www.nginx.com/resources/wiki/start/topics/examples/full/) helpful, but remember, the configuration you need is pretty straight forward, if you end up doing complex things, you are most likely doing something wrong.

If and when your app "does not work", remember to have a look in log, it can be pretty helpful in pinpointing errors:

```bash
2_7-proxy-1  | /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
2_7-proxy-1  | /docker-entrypoint.sh: Configuration complete; ready for start up
2_7-proxy-1  | 2023/03/05 09:24:51 [emerg] 1#1: invalid URL prefix in /etc/nginx/nginx.conf:8
2_7-proxy-1 exited with code 1
```

Submit the docker-compose.yml

:::

:::info Exercise 2.9

Most of the buttons may have stopped working in the example application. Make sure that every button for exercises works.

Remember to take a peek into the browsers developer consoles again like we did back [part 1](/part-1/section-6), remember also [this](https://github.com/docker-hy/material-applications/tree/main/example-frontend#exercise-114---to-connect-to-backend) and [this](https://github.com/docker-hy/material-applications/tree/main/example-backend).

The buttons of Nginx exercise and the first button behave differently but you want them to match.

If you had to do any changes explain what you did and where.

Submit the docker-compose.yml and both Dockerfiles.

:::

:::tip Publishing ports to host network

There is an important lesson about Docker networking and ports to be learned in the next exercise.

When we do a [port mapping](https://docs.docker.com/desktop/networking/#port-mapping), in `docker run -p 8001:80 ...` or in Docker Compose file, we are [publishing](https://docs.docker.com/config/containers/container-networking/#published-ports) a container port to the host network to be accessible in localhost.

The container port is there within the Docker network accessible by the other containers who are in the same network even if we do not publish anything. So publishing the ports is only for exposing ports outside the Docker network. If no direct access outside the network is not needed, then we just do not publish anything.
:::

:::info Exercise 2.10

Now we have the reverse proxy up and running! All the communication to our app should be done through the reverse proxy and direct access (eg. accessing the backend with a GET to http://localhost:8080/ping ) should be prevented.

Use a port scanner, eg <https://hub.docker.com/r/networkstatic/nmap> to ensure that there are no extra ports open in the host.

It might be enough to just run

```
$ docker run -it --rm --network host networkstatic/nmap localhost
```

If you have an M1/M2 Mac, you might need to build the image yourself.

The result looks like the following (I used a self-built image):

```bash
$ docker run -it --rm --network host nmap localhost
Starting Nmap 7.93 ( https://nmap.org ) at 2023-03-05 12:28 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0000040s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 996 closed tcp ports (reset)
PORT     STATE    SERVICE
80/tcp   filtered http
111/tcp  open     rpcbind
5000/tcp filtered commplex-link
8080/tcp filtered http-proxy

Nmap done: 1 IP address (1 host up) scanned in 1.28 seconds
```

As we see, there are two suspicious open ports: 5000 and 8080. So it is obvious that the frontend and backend are still directly accessible in the host network. This should be fixed!

You are done when the port scan report looks something like this:

```bash
Starting Nmap 7.93 ( https://nmap.org ) at 2023-03-05 12:39 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0000040s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 998 closed tcp ports (reset)
PORT    STATE    SERVICE
80/tcp  filtered http
111/tcp open     rpcbind

Nmap done: 1 IP address (1 host up) scanned in 1.28 seconds
```

:::
