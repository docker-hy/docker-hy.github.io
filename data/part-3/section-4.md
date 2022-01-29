---
path: '/part-3/4-optimizing-the-image-size'
title: 'Optimizing the image size'
hidden: false
---

The bigger your image is the larger the surface area for an attack is. The following tutorial to "Building Small Containers" from Google is an excellent video to showcase the importance of optimizing your Dockerfiles:

<p>
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/wGz_cbtCiEA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

Let's start by reducing the number of layers. To keep track of the improvements, we will follow the image size after each new Dockerfile.

```dockerfile
FROM ubuntu:18.04

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl
RUN useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**209MB**

We will glue all `RUN` commands together to reduce the number of layers we are making in our image.

```dockerfile
FROM ubuntu:18.04

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    curl python && \
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+x /usr/local/bin/youtube-dl && \
    useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**207MB**

As a sidenote not directly related to docker: remember that if needed, it is possible to bind packages to versions with `curl=1.2.3` - this will ensure that if the image is built at the later date the image is more likely to work as the versions are exact. On the other hand, the packages will be old and have security issues.

With `docker image history` we can see that our single `RUN` layer adds 76.7 megabytes to the image:

```console
$ docker image history youtube-dl

  IMAGE          CREATED              CREATED BY                                      SIZE      COMMENT
  f221975422c3   About a minute ago   /bin/sh -c #(nop)  ENTRYPOINT ["/usr/local/b…   0B
  940a7510dc5d   About a minute ago   /bin/sh -c #(nop)  USER appuser                 0B
  31062eddb851   About a minute ago   /bin/sh -c apt-get update && apt-get install…   76.7MB
  ...
```

The next step is to remove everything that is not needed in the final image. We don't need the apt source lists anymore, so we can glue the next line to our single `RUN`

```console
.. && \
rm -rf /var/lib/apt/lists/*
````

Now, after we build, the size of the layer is 45.6MB megabytes. We can optimize even further by removing the `curl`. We can remove `curl` and all the dependencies it installed with

```console
.. && \
apt-get purge -y --auto-remove curl && \
rm -rf /var/lib/apt/lists/*
````

..which brings us down to 34.9MB.

Now our slimmed down container should work, but:

```console
$ docker container run -v "$(pwd):/usr/videos" youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage

  ERROR: Unable to download webpage: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)> (caused by URLError(SSLError(1, u'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)'),))
```

Because `--auto-remove` also removed dependencies, like:

```console
  Removing ca-certificates (20170717~18.04.1) ...
```

We can now see that our `youtube-dl` worked previously because of our `curl` dependencies. If `youtube-dl` would have been installed as a package, it would have declared `ca-certificates` as its dependency.

Now what we could do is to first `purge --auto-remove` and then add `ca-certificates` back with `apt-get install` or just install `ca-certificates` along with other packages before removing `curl`:

```dockerfile
FROM ubuntu:18.04

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    curl python ca-certificates && \
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+x /usr/local/bin/youtube-dl && \
    apt-get purge -y --auto-remove curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**168MB**

From the build output we can see that `ca-certificates` also adds `openssl`

```console
  The following additional packages will be installed:
  openssl

  The following NEW packages will be installed:
  ca-certificates openssl
```

and this brings us to 36.9 megabytes in our `RUN` layer (from the original 76.7 megabytes).

<exercise name="Exercise 3.4">

  Return back to our [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend) &
  [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend) Dockerfiles and you should see the some mistakes we now
  know to fix.

  Document both image sizes at this point, as was done in the material. Optimize the Dockerfiles of both programs,
  frontend and backend, by joining the RUN commands and removing useless parts.

  After your improvements document the image sizes again. The size difference may not be very much yet. The frontend
  should be around 432MB when using `FROM ubuntu:18.04`. The backend should be around 351MB. The sizes may vary.


</exercise>

## Alpine Linux variant ##

Our Ubuntu base image adds the most megabytes to our image (approx 113MB).  Alpine Linux provides a popular alternative base in https://hub.docker.com/_/alpine/ that is around 4 megabytes. It's based on altenative glibc implementation musl and busybox binaries, so not all software run well (or at all) with it, but our python container should run just fine. We'll create the following `Dockerfile.alpine` file:

```dockerfile
FROM alpine:3.13

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apk add --no-cache curl python3 ca-certificates && \
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+x /usr/local/bin/youtube-dl && \
    apk del curl && \
    adduser -D userapp

USER userapp

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**45.1MB**

Notes:
 - The package manager is `apk` and it can work without downloading sources (caches) first with `--no-cache`.
 - `useradd` is missing, but `adduser` exists.
 - Most of the package names are the same - there's a good package browser at https://pkgs.alpinelinux.org/packages.

Now when we build this file with `:alpine-3.13` as the tag:

```console
$ docker build -t youtube-dl:alpine-3.13 -f Dockerfile.alpine .
```

It seems to run fine:

```console
$ docker container run -v "$(pwd):/usr/videos" youtube-dl:alpine-3.13 https://imgur.com/JY5tHqr
```

From the history we can see that the our single `RUN` layer size is 39.4MB

```console
$ docker image history youtube-dl:alpine-3.13

  IMAGE...
  ...
  14cfb0b531fb        20 seconds ago         /bin/sh -c apk add --no-cache curl python ca…   39.4MB
  ...
  <missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:093f0723fa46f6cdb…   5.61MB
```

So in total our Alpine variant is about 45 megabytes, significantly less than our Ubuntu based image.

Back in part 1 we published the ubuntu version of youtube-dl with tag latest.

We can publish both variants without overriding the other by publishing them with a describing tag:

```console
$ docker image tag youtube-dl:alpine-3.13 <username>/youtube-dl:alpine-3.13
$ docker image push <username>/youtube-dl:alpine-3.13
```

OR, if we don't want to upkeep the ubuntu version anymore we can replace our Ubuntu image by pushing this as the latest. Someone might depend on the image being ubuntu though.

```console
$ docker image tag youtube-dl:alpine-3.13 <username>/youtube-dl
$ docker image push <username>/youtube-dl
```

Also remember that unless specified the `:latest` tag will always just refer to the latest image build & pushed - that can basically contain anything.

<exercise name="Exercise 3.5">

  Document the image size before the changes.

  Let's test what the image sizes are when using FROM golang and FROM node in the backend and frontend projects respectively.

  Return back to our frontend & backend Dockerfiles and change the FROM to something more suitable. Both should have at least alpine variants ready in DockerHub. Make sure the
  application still works after the changes.

  Document the size after your changes.

</exercise>

## Multi-stage builds ##

Multi-stage builds are useful when you need some tools just for the build but not for the execution of the image CMD. This is an easy way to reduce size in some cases.

Let's create a website with Jekyll, build the site for production and serve the static files with nginx.
Start by creating the recipe for Jekyll to build the site.

```dockerfile
FROM ruby:3

WORKDIR /usr/app

RUN gem install jekyll
RUN jekyll new .
RUN jekyll build
```

This creates a new Jekyll application and builds it. We could start thinking about optimizations at this point but instead we're going add a new FROM for nginx, this is what resulting image will be. And copy the built static files from the ruby image to our nginx image.

```dockerfile
FROM ruby:3 as build-stage
...
FROM nginx:1.19-alpine

COPY --from=build-stage /usr/app/_site/ /usr/share/nginx/html
```

This copies contents from the first image `/usr/app/_site/` to `/usr/share/nginx/html` Note the naming from ruby to build-stage. We could also use external image as a stage, `--from=python:3.7` for example. Lets build and check the size difference:

```console
$ docker build . -t jekyll
$ docker image ls
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  jekyll              latest              5f8839505f37        37 seconds ago      109MB
  ruby                latest              616c3cf5968b        28 hours ago        870MB
```

As you can see, even though our jekyll image needed ruby during the build process, its considerably smaller since it only has nginx and the static files. `docker container run -it -p 8080:80 jekyll` also works as expected.

Often the best choice is to use a FROM **scratch** image as it doesn't have anything we don't explicitly add there, making it most secure option over time.

<exercise name="Exercise 3.6 part 1: Multi-stage frontend">

  Multi-stage builds. Lets do a multi-stage build for the
  [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend) project since we've come so far with the application.

  Even though multi-stage builds are designed mostly for binaries in mind, we can leverage the benefits with our
  frontend project as having original source code with the final assets makes little sense. Build it with the
  instructions in README and the built assets should be in `build` folder.

  You can still use the `serve` to serve the static files or try out something else.


</exercise>

<exercise name="Exercise 3.6 part 2: Multi-stage backend">

  Lets do a multi-stage build for the [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend) project since we've come so far with the application.

  The project is in golang and building a binary that runs in a container, while straightforward, isn't exactly trivial. Use resources that you have available (Google, example projects) to build the binary and run it inside a container that uses FROM scratch.

  To pass the exercise the image must be smaller than <b>25MB</b>.

</exercise>

<exercise name="Exercise 3.7">
  Do all or most of the optimizations from security to size for any other Dockerfile you have access to, in your own project or for example the ones used in previous "standalone" exercises.

  Please document Dockerfiles both before and after.
</exercise>
