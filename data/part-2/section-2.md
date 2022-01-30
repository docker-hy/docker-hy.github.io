---
path: "/part-2/2-docker-networking"
title: "Docker networking"
hidden: false
---

Connecting two services such as a server and its database in docker can be achieved with docker-compose networks. In addition to starting services listed in docker-compose.yml the tool automatically creates and joins both containers into a network with a DNS. Each container service is named after their container name and as such containers can reference each other simply with their names.

<img src="../img/2/docker-networks.png">

Here are two services in a single network: webapp and webapp-helper. The webapp-helper has a server, listening for requests in port 3000, that webapp wants to access. Because they were defined in the same docker-compose.yml file the access is trivial. Docker-compose has already taken care of creating a network and webapp can simply send a request to webapp-helper:3000, the internal DNS will translate that to the correct access and ports do not have to be published outside of the network.

<text-box name="Security reminder: Plan your infrastructure and keep to your plan" variant="hint">

In the next exercise, and in some later exercises, I will supply you with an illustration of the infrastructure. Do look at it and use it to write the configuration.

For example, in 2.4 we don't want to open ports to Redis to the outside world. Do not add a `ports` configuration under redis. The backend will be able to access the application within the docker network.

</text-box>

<exercise name="Exercise 2.4">

Add redis to example backend.

Redis is used to speed up some operations. Backend uses a slow api to get information. You can test the slow api by
requesting `/ping?redis=true` with curl. The frontend program has a button to test this.

Configure a redis container to cache information for the backend. Use the documentation if needed when configuring:
[https://hub.docker.com/\_/redis/](https://hub.docker.com/_/redis/)

The backend [README](https://github.com/docker-hy/material-applications/tree/main/example-backend) should have all the information needed to
connect.

When you've correctly configured the button will turn green.

Submit the docker-compose.yml

  <img src="../img/exercises/back-front-and-redis.png" />

The [restart: unless-stopped](https://docs.docker.com/compose/compose-file/compose-file-v3/#restart) configuration can help if the redis takes a while to get ready.

</exercise>

You can also manually define the network and its name. A major benefit of defining network is that it makes it easy to setup a configuration where other containers connect to an existing network as an external network. This is used when a container wishes to interact with a container defined in another docker-compose file.

Defining network in docker-compose.yml. Services can be added to networks by adding `networks` into the definition of the service:

```yaml
version: "3.8"

services:
  db:
    image: postgres:13.2-alpine
    networks:
      - database-network # Name in this docker-compose file

networks:
  database-network: # Name in this docker-compose file
    name: database-network # Name that will be the actual name of the network
```

This defines a network called `database-network` which is created with `docker-compose up` and removed with `docker-compose down`.

To connect to an external network (possibly defined another docker-compose.yml):

```yaml
version: "3.8"

services:
  db:
    image: backend-image
    networks:
      - database-network

networks:
  database-network:
    external:
      name: database-network # Must match the actual name of the network
```

By default all services are added to a network called `default`. The default network can be configured and this makes it possible to connect to an external network by default as well:

```yaml
version: "3.8"

services:
  db:
    image: backend-image

networks:
  default:
    external:
      name: database-network # Must match the actual name of the network
```

# Scaling

Compose can also scale the service to run multiple instances:

```console
$ docker-compose up --scale whoami=3

  WARNING: The "whoami" service specifies a port on the host. If multiple containers for this service are created on a single host, the port will clash.

  Starting whoami_whoami_1 ... done
  Creating whoami_whoami_2 ... error
  Creating whoami_whoami_3 ... error
```

The command fails due to a port clash, as each instance will attempt to bind to the same host port (8000).

We can get around this by only specifying the container port. As mentioned in [part 1](/part1/#allowing-external-connections-into-containers), when leaving the host port unspecified, Docker will automatically choose a free port.

Update the ports definition in `docker-compose.yml`:

```yaml
ports:
  - 8000
```

Then run the command again:

```console
$ docker-compose up --scale whoami=3
  Starting whoami_whoami_1 ... done
  Creating whoami_whoami_2 ... done
  Creating whoami_whoami_3 ... done
```

All three instances are now running and listening on random host ports. We can use `docker-compose port` to find out which ports the instances are bound to.

```console
$ docker-compose port --index 1 whoami 8000
  0.0.0.0:32770

$ docker-compose port --index 2 whoami 8000
  0.0.0.0:32769

$ docker-compose port --index 3 whoami 8000
  0.0.0.0:32768
```

We can now curl from these ports:

```console
$ curl 0.0.0.0:32769
  I'm 536e11304357

$ curl 0.0.0.0:32768
  I'm 1ae20cd990f7
```

In a server environment you'd often have a load balancer in-front of the service. For local environment (or a single server) one good solution is to use <https://github.com/jwilder/nginx-proxy> that configures nginx from docker daemon as containers are started and stopped.

Let's add the proxy to our compose file and remove the port bindings from the whoami service. We'll mount our `docker.sock` inside of the container in `:ro` read-only mode.

```yaml
version: "3.8"

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

```console
$ docker-compose up -d --scale whoami=3
$ curl localhost:80
  <html>
  <head><title>503 Service Temporarily Unavailable</title></head>
  <body bgcolor="white">
  <center><h1>503 Service Temporarily Unavailable</h1></center>
  <hr><center>nginx/1.13.8</center>
  </body>
  </html>
```

It's "working", but the nginx just doesn't know which service we want. The `nginx-proxy` works with two environment variables: `VIRTUAL_HOST` and `VIRTUAL_PORT`. `VIRTUAL_PORT` is not needed if the service has `EXPOSE` in it's docker image. We can see that `jwilder/whoami` sets it: <https://github.com/jwilder/whoami/blob/master/Dockerfile#L9>

Note:

- For Mac users with the M1 chip you may see the following error message: `runtime: failed to create new OS thread`. In this case you can use the docker image `ninanung/nginx-proxy` instead which offers a temporary fix until `jwilder/nginx-proxy` is updated to support M1 Macs.

The domain `colasloth.com` is configured so that all subdomains point to `127.0.0.1`. More information about how this works can be found at [colasloth.github.io](https://colasloth.github.io), but in brief it's a simple DNS "hack". Several other domains serving the same purpose exist, such as `localtest.me`, `lvh.me`, and `vcap.me`, to name a few. In any case, let's use `colasloth.com` here:

```yaml
version: "3.8"

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

```console
$ docker-compose up -d --scale whoami=3
$ curl whoami.colasloth.com
  I'm f6f85f4848a8
$ curl whoami.colasloth.com
  I'm 740dc0de1954
```

Let's add couple of more containers behind the same proxy. We can use the official `nginx` image to serve a simple static web page. We don't have to even build the container images, we can just mount the content to the image. Let's prepare some content for two services called "hello" and "world".

```console
$ echo "hello" > hello.html
$ echo "world" > world.html
```

Then add these services to the `docker-compose.yml` file where you mount just the content as `index.html` in the default nginx path:

```yaml
hello:
  image: nginx:1.19-alpine
  volumes:
    - ./hello.html:/usr/share/nginx/html/index.html:ro
  environment:
    - VIRTUAL_HOST=hello.colasloth.com
world:
  image: nginx:1.19-alpine
  volumes:
    - ./world.html:/usr/share/nginx/html/index.html:ro
  environment:
    - VIRTUAL_HOST=world.colasloth.com
```

Now let's test:

```console
$ docker-compose up -d --scale whoami=3
$ curl hello.colasloth.com
  hello

$ curl world.colasloth.com
  world

$ curl whoami.colasloth.com
  I'm f6f85f4848a8

$ curl whoami.colasloth.com
  I'm 740dc0de1954
```

Now we have a basic single machine hosting setup up and running.

Test updating the `hello.html` without restarting the container, does it work?

<exercise name="Exercise 2.5">

A project over at [https://github.com/docker-hy/material-applications/tree/main/scaling-exercise](https://github.com/docker-hy/material-applications/tree/main/scaling-exercise) has a hardly working application. Go ahead and clone it for yourself. The project already includes docker-compose.yml so you can start it by running `docker-compose up`.

Application should be accessible through [http://localhost:3000](http://localhost:3000). However it doesn't work well enough and I've added a load balancer for scaling. Your task is to scale the `compute` containers so that the button in the application turns green.

This exercise was created with [Sasu Mäkinen](https://github.com/sasumaki)

Please return the used commands for this exercise.

</exercise>
