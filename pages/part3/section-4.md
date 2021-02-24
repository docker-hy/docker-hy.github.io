# Optimizing the Dockerfile #

Lets go back to part 1 and remember the minor problem that our container build process creates many layers resulting in increased image size.

```dockerfile
FROM ubuntu:16.04

WORKDIR /mydir

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl

ENV LC_ALL=C.UTF-8

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

Now we'll fix the minor problem of our Dockerfile being non-logical. In the first version we have just commands rearranged so that the build process is logical:

```dockerfile
FROM ubuntu:16.04 

ENV LC_ALL=C.UTF-8 

RUN apt-get update
RUN apt-get install -y \ 
    curl python 
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl 
RUN chmod a+x /usr/local/bin/youtube-dl 

WORKDIR /app 

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 

``` 

We have also changed the `WORKDIR` to be `/app` as it's a fairly common convention to put your own stuff in different public docker images. For this image where we essentially download videos, a `WORKDIR /videos` or similar might also make sense.  

In the next phase we'll glue all `RUN` commands together to reduce the number of layers we are making in our image. 

```dockerfile
FROM ubuntu:16.04 

ENV LC_ALL=C.UTF-8  

RUN apt-get update && apt-get install -y \ 
    curl python && \ 
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \ 
    chmod a+x /usr/local/bin/youtube-dl 

WORKDIR /app 

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
``` 

As a sidenote not directly related to docker: remember that if needed, it is possible to bind packages to versions with `curl=1.2.3` - this will ensure that if the image is built at the later date, then the image is more likely to work, because the versions are exact. On the other hand the packages will be old and have security issues.  

With `docker image history` we can see that our single `RUN` layer adds 85.2 megabytes to the image: 

```console
$ docker image history youtube-dl 

  IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT 
  295b16d6560a        30 minutes ago      /bin/sh -c #(nop)  ENTRYPOINT ["/usr/local...   0B 
  f65f66bbae17        30 minutes ago      /bin/sh -c #(nop) WORKDIR /app                  0B 
  89592bae75a8        30 minutes ago      /bin/sh -c apt-get update && apt-get insta...   85.2MB 
  .`.. 
```

The next step is to remove everything that is not needed in the final image. We don't need the apt source lists anymore, so we'll glue the next line to our single `RUN` 

```console
.. && \ 
rm -rf /var/lib/apt/lists/* 
````

Now when we build, we'll see that the size of the layer is 45.6MB megabytes. We can optimize even further by removing the `curl`. We can remove `curl` and all the dependencies it installed with 

```console
.. && \ 
apt-get purge -y --auto-remove curl && \ 
rm -rf /var/lib/apt/lists/* 
````

..which brings us down to 34.9MB.

Now our slimmed down container should work, but: 

```console
$ docker container run -v "$(pwd):/app" youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage

  ERROR: Unable to download webpage: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)> (caused by URLError(SSLError(1, u'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:590)'),))
```

Because `--auto-remove` also removed dependencies, like: 

```console
  Removing ca-certificates (20170717~16.04.1) ... 
```

We can now see that our `youtube-dl` worked previously because of our `curl` dependencies. If `youtube-dl` would have been installed as a package, it would have declared `ca-certificates` as its dependency. 

Now what we could do is to first `purge --auto-remove` and then add `ca-certificates` back with `apt-get install` or just install `ca-certificates` along with other packages before removing `curl`:  

```dockerfile
FROM ubuntu:16.04 

ENV LC_ALL=C.UTF-8 

RUN apt-get update && apt-get install -y \ 
    curl python ca-certificates && \ 
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \ 
    chmod a+x /usr/local/bin/youtube-dl && \ 
    apt-get purge -y --auto-remove curl && \ 
    rm -rf /var/lib/apt/lists/* 

WORKDIR /app 

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
``` 

From the build output we can see that `ca-certificates` also adds `openssl` 

```console
  The following additional packages will be installed: 
  openssl 

  The following NEW packages will be installed: 
  ca-certificates openssl 
```

and this brings us to 36.4 megabytes in our `RUN` layer (from the original 87.4 megabytes). 

{% include_relative exercises/3_1.html %}

## Alpine Linux variant ##

Our Ubuntu base image adds the most megabytes to our image (approx 113MB).  Alpine Linux provides a popular alternative base in https://hub.docker.com/_/alpine/ that is around 4 megabytes. It's based on altenative glibc implementation musl and busybox binaries, so not all software run well (or at all) with it, but our python container should run just fine. We'll create the following `Dockerfile.alpine` file:  

```dockerfile
FROM alpine:3.7 

ENV LC_ALL=C.UTF-8 

RUN apk add --no-cache curl python ca-certificates && \ 
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \ 
    chmod a+x /usr/local/bin/youtube-dl && \ 
    apk del curl && \ 
    adduser -D app 

USER app 

WORKDIR /app 

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
``` 

Notes: 
 - The package manager is `apk` and it can work without downloading sources (caches) first with `--no-cache`.
 - `useradd` is missing, but `adduser` exists. 
 - Most of the package names are the same - there's a good package browser at https://pkgs.alpinelinux.org/packages.

Now when we build this file with `:alpine-3.7` as the tag: 

```console
$ docker build -t youtube-dl:alpine-3.7 -f Dockerfile.alpine . 
```

It seems to run fine:  

```console
$ docker container run -v "$(pwd):/app" youtube-dl:alpine-3.7 https://imgur.com/JY5tHqr
```

From the history we can see that the our single `RUN` layer size is 41.1MB 

```console
$ docker image history youtube-dl:alpine-3.7 

  IMAGE... 
  ... 
  14cfb0b531fb        20 seconds ago         /bin/sh -c apk add --no-cache curl python ca…   41.1MB 
  ... 
  <missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:093f0723fa46f6cdb…   4.15MB 
```

So in total our Alpine variant is about 45 megabytes, significantly less than our Ubuntu based image. 

Back in part 1 we published the ubuntu version of youtube-dl with tag latest.

We can publish both variants without overriding the other by publishing them with a describing tag: 

```console
$ docker image tag youtube-dl:alpine-3.7 <username>/youtube-dl:alpine-3.7 
$ docker image push <username>/youtube-dl:alpine-3.7 
```

OR, if we don't want to upkeep the ubuntu version anymore we can replace our Ubuntu image by pushing this as the latest. Someone might depend on the image being ubuntu though.

```console
$ docker image tag youtube-dl:alpine-3.7 <username>/youtube-dl 
$ docker image push <username>/youtube-dl 
```

Also remember that unless specified the `:latest` tag will always just refer to the latest image build & pushed - that can basically contain anything. 

{% include_relative exercises/3_5.html %}

## Multi-stage builds ##

Multi-stage builds are useful when you need some tools just for the build but not for the execution of the image CMD. This is an easy way to reduce size in some cases.

Let's create a website with Jekyll, build the site for production and serve the static files with nginx.
Start by creating the recipe for Jekyll to build the site.

```dockerfile
FROM ruby

WORKDIR /usr/app

RUN gem install jekyll
RUN jekyll new .
RUN jekyll build
```

This creates a new Jekyll application and builds it. We could start thinking about optimizations at this point but instead we're going add a new FROM for nginx, this is what resulting image will be. And copy the built static files from the ruby image to our nginx image.

```dockerfile
FROM ruby as build-stage
...
FROM nginx

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

{% include_relative exercises/3_6.html %}
{% include_relative exercises/3_7.html %}
