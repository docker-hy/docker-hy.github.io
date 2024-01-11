---
title: 'Optimizing the image size'
---

A small image size has many advantages, firstly, it takes much less time to pull a small image from the registry. Another thing is the security: the bigger your image is the larger the surface area for an attack it has.

The following tutorial to "Building Small Containers" from Google is an excellent video to showcase the importance of optimizing your Dockerfiles:

<p>
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/wGz_cbtCiEA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

Before going on to the tricks that were shown on the video, let us start start by reducing the number of layers. What actually is a layer? According to the [documentation](https://docs.docker.com/get-started/overview/#how-does-a-docker-image-work):

_To build your own image, you create a Dockerfile with a simple syntax for defining the steps needed to create the image and run it. Each instruction in a Dockerfile creates a layer in the image. When you change the Dockerfile and rebuild the image, only those layers which have changed are rebuilt. This is part of what makes images so lightweight, small, and fast, when compared to other virtualization._

So each command that is executed to the base image, forms an layer. The resulting image is the final layer, that combines the changes that all the intermediate layers contains. Each layer potentially adds something extra to the resulting image so it might be a good idea to minimize the number of layers.

To keep track of the improvements, we keep on note of the image size after each new Dockerfile.

```dockerfile
FROM ubuntu:18.04

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://github.com/ytdl-org/youtube-dl/releases/download/2021.12.17/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl
RUN useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**133MB**

As was said each command that is executed to the base image, forms an layer. Command here refers to one Dockerfile directive such as `RUN`. We could now glue all `RUN` commands together to reduce the number of layers that are created when building the image:

```dockerfile
FROM ubuntu:18.04

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y \
    curl python && \
    curl -L https://github.com/ytdl-org/youtube-dl/releases/download/2021.12.17/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+x /usr/local/bin/youtube-dl && \
    useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**131MB**

There is not that much difference, the image with less layers is 2 MB smaller.

As a sidenote not directly related to Docker: remember that if needed, it is possible to bind packages to versions with `curl=1.2.3` - this will ensure that if the image is built at the later date the image is more likely to work as the versions are exact. On the other hand, the packages will be old and have security issues.

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

Now, after we build, the size of the layer is 100 megabytes. We can optimize even further by removing the `curl`. We can remove `curl` and all the dependencies it installed with

```console
.. && \
apt-get purge -y --auto-remove curl && \
rm -rf /var/lib/apt/lists/*
````

... which brings us down to 94 MB.

## Exercise 3.6

:::info Exercise 3.6

  Return now back to our [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend) and
  [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend) Dockerfile.

  Document both image sizes at this point, as was done in the material. Optimize the Dockerfiles of both app, frontend and backend, by joining the RUN commands and removing useless parts.

  After your improvements document the image sizes again. The size difference may not be very much yet.

:::

## Alpine Linux variant ##

Our Ubuntu base image adds the most megabytes to our image. [Alpine Linux](https://www.alpinelinux.org/) provides a popular alternative base in https://hub.docker.com/_/alpine/ that is around 4 megabytes. It's based on altenative glibc implementation musl and busybox binaries, so not all software run well (or at all) with it, but our container should run just fine. We'll create the following `Dockerfile.alpine` file:

```dockerfile
FROM alpine:3.13

WORKDIR /usr/videos

ENV LC_ALL=C.UTF-8

RUN apk add --no-cache curl python3 ca-certificates && \
    curl -L https://github.com/ytdl-org/youtube-dl/releases/download/2021.12.17/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+x /usr/local/bin/youtube-dl && \
    apk del curl && \
    adduser -D userapp && \
    ln -s /usr/bin/python3 /usr/bin/python

USER userapp

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

**51.7MB**

Notes:
 - The package manager is `apk` and it can work without downloading sources (caches) first with `--no-cache`.
 - `useradd` is missing, but `adduser` exists.
 - Most of the package names are the same - there's a good package browser at https://pkgs.alpinelinux.org/packages.
 - The youtube-dl assumes that Python executable is called `python`. When we installed the version 3 of Python, the executable is called `python3` and that is why the last line of the RUN directive makes a [symbolic link](https://linuxize.com/post/how-to-create-symbolic-links-in-linux-using-the-ln-command/) so that both names can be user to run Python

Now when we build this file with `:alpine-3.13` as the tag:

```console
$ docker build -t youtube-dl:alpine-3.13 -f Dockerfile.alpine .
```

It seems to run fine:

```console
$ docker container run -v "$(pwd):/usr/videos" youtube-dl:alpine-3.13 https://imgur.com/JY5tHqr
```

From the history we can see that the our single `RUN` layer size is 46.3MB

```console
$ docker image history youtube-dl:alpine-3.13

  IMAGE...
  ...
  14cfb0b531fb        20 seconds ago         /bin/sh -c apk add --no-cache curl python ca…   46.3MB
  ...

  <missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:093f0723fa46f6cdb…   5.61MB
```

So in total our Alpine variant is about 52 megabytes, significantly less than our Ubuntu based image.

Back in part 1 we published the Ubuntu version of youtube-dl with tag latest.

We can publish both variants without overriding the other by publishing them with a describing tag:

```console
$ docker image tag youtube-dl:alpine-3.13 <username>/youtube-dl:alpine-3.13
$ docker image push <username>/youtube-dl:alpine-3.13
```

OR, if we don't want to upkeep the Ubuntu version anymore we can replace our Ubuntu image by pushing this as the latest. Someone might depend on the image being Ubuntu though.

```console
$ docker image tag youtube-dl:alpine-3.13 <username>/youtube-dl
$ docker image push <username>/youtube-dl
```

Also remember that unless specified the `:latest` tag will always just refer to the latest image build & pushed - that can basically contain anything.

## Exercise 3.7

:::info Exercise 3.7

  As you may have guessed, you shall now return back to the example frontend and backend.

   Change the base image in FROM to something more suitable. Both should have at least Alpine variants ready in DockerHub. Make sure the application still works after the changes.

  Document the size before and after your changes.

:::

## Multi-stage builds ##

Multi-stage builds are useful when you need some tools just for the build but not for the execution of the image (that is for CMD or ENTRYPOINT). This is an easy way to reduce size in some cases.

Let's create a website with [Jekyll](https://jekyllrb.com/), build the site for production and serve the static files with Nginx. Start by creating the recipe for Jekyll to build the site.

```dockerfile
FROM ruby:3

WORKDIR /usr/app

RUN gem install jekyll
RUN jekyll new .
RUN jekyll build
```

This creates a new Jekyll application and builds it. We are going to use Nginx to serve the site page but you can test how the site works if you add the following directive:

```dockerfile
CMD bundle exec jekyll serve --host 0.0.0.0
```

We could start thinking about optimizations at this point but instead we're going add a new FROM for Nginx, this is what resulting image will be. Then we will copy the built static files from the Ruby image to our Nginx image:

```dockerfile
# the  first stage needs to be given a name
FROM ruby:3 as build-stage
WORKDIR /usr/app

RUN gem install jekyll
RUN jekyll new .
RUN jekyll build

# we will now add a new stage
FROM nginx:1.19-alpine

COPY --from=build-stage /usr/app/_site/ /usr/share/nginx/html
```

Now Docker copies contents from the first image `/usr/app/_site/` to `/usr/share/nginx/html` Note the naming from Ruby to _build-stage_. We could also use external image as a stage, `--from=python:3.7` for example.

Let's build and check the size difference:

```console
$ docker build . -t jekyll
$ docker image ls
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  jekyll              latest              5f8839505f37        37 seconds ago      109MB
  ruby                latest              616c3cf5968b        28 hours ago        870MB
```

As you can see, even though our Jekyll image needed Ruby during the build stage, its considerably smaller since it only has Nginx and the static files. `docker container run -it -p 8080:80 jekyll` also works as expected.

Often the best choice is to use a FROM **scratch** image as it doesn't have anything we don't explicitly add there, making it most secure option over time.

## Exercises 3.8 - 3.10


:::info Exercise 3.8: Multi-stage frontend

  Do now a multi-stage build for the example
  [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend).

  Even though multi-stage builds are designed mostly for binaries in mind, we can leverage the benefits with our frontend project as having original source code with the final assets makes little sense. Build it with the
  instructions in README and the built assets should be in `build` folder.

  You can still use the `serve` to serve the static files or try out something else.

:::

:::info Exercise 3.9: Multi-stage backend

  Lets do a multi-stage build for the [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend) project since we've come so far with the application.

  The project is in golang and building a binary that runs in a container, while straightforward, isn't exactly trivial. Use resources that you have available (Google, example projects) to build the binary and run it inside a container that uses `FROM scratch`.

  To successfully complete the exercise the image must be smaller than <b>25MB</b>.

:::

:::info Exercise 3.10

  Do all or most of the optimizations from security to size for **one** other Dockerfile you have access to, in your own project or for example the ones used in previous "standalone" exercises.

  Please document Dockerfiles both before and after.

:::
