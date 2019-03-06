---
layout: page
title: part 3
inheader: yes
permalink: /part3/
order: 0
---

# Deeper understanding of Docker

Until now we've focused on using Docker as a tool to solve various types of problems, but meanwhile we have decided to push some of the issues until later and completely ignored others.

Every Dockerfile we've used until now has been FROM ubuntu, which is inefficient, and the user has been root, which is potentially dangerous. In addition we're still restricting ourselves into one physical computer. Unfortunately the last problem is out of our reach for this course. But we get to look at alternative solutions.

# Look into the ubuntu image

Let's look into the ubuntu image on [Docker Hub](https://hub.docker.com/r/library/ubuntu/)

The description/readme says: 

```
What's in this image?

This image is built from official rootfs tarballs provided by Canonical (specifically, https://partner-images.canonical.com/core/). 
```

From the links we can guess (not truly know) that the image is built from <https://github.com/tianon/docker-brew-ubuntu-core> - So from a person named "Tianon Gravi".

In that git repository's [README](https://github.com/tianon/docker-brew-ubuntu-core/tree/master#scripts-to-prepare-updates-to-the-ubuntu-official-docker-images) it says: 

> Some more Jenkins happens 

which means that in somewhere there's a Jenkins server that runs this script and publishes image to the registry - we have no way of knowing if this is true or not. 

Let's see how the image was really built from <https://hub.docker.com/r/_/ubuntu/> by clicking the 16.04 [Dockerfile link](https://github.com/tianon/docker-brew-ubuntu-core/blob/490e0e86ec5c93524b7ae37b79025e5ded5efcc6/xenial/Dockerfile).

We get to the `Dockerfile` that specifies all the commands that were used to create this image. 

The first line states that the image starts FROM a **special** image "scratch" that is just empty. Then a file `ubuntu-xenial-core-cloudimg-amd64-root.tar.gz` is added to the root from the same [directory](https://github.com/tianon/docker-brew-ubuntu-core/tree/490e0e86ec5c93524b7ae37b79025e5ded5efcc6/xenial).

This file should be the "..official rootfs tarballs provided by Canonical" mentioned earlier, but it's not actually coming from <https://partner-images.canonical.com/core/xenial/current/>, it's copied to the repo owned by "tianon". We could verify the checksums of the file if we were interested. 

Notice how the file is not extracted at any point, this is because the `ADD` documentation states in [Docker documentation](https://docs.docker.com/engine/reference/builder/#add) that "If src is a local tar archive in a recognized compression format (identity, gzip, bzip2 or xz) then it is unpacked as a directory. " 

Before getting stressed by the potential security problems with this we have to remind ourselves of Ken Thompsons "You can't trust code that you did not totally create yourself." (1984, Reflections on Trusting Trust). However, we assume that the `ubuntu:16.04` that we downloaded is this image, because 

    $ docker history --no-trunc ubuntu:16.04 

matches with the directives specified in the `Dockerfile`.  We could also build the image ourselves if we really wanted - there is nothing special in the "official" image and the build process is, as we saw, truly open. 


# Optimizing the Dockerfile 

Lets go back to part 1 and remember the minor problem that our container build process creates many layers resulting in increased image size.

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

Now we'll fix the minor problem of our Dockerfile being non-logical and not very space efficient. In the first version we have just commands rearranged so that the build process is logical: 

``` 
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

``` 
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

With `docker history` we can see that our single `RUN` layer adds 85.2 megabytes to the image: 

    $ docker history youtube-dl 

      IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT 
      295b16d6560a        30 minutes ago      /bin/sh -c #(nop)  ENTRYPOINT ["/usr/local...   0B 
      f65f66bbae17        30 minutes ago      /bin/sh -c #(nop) WORKDIR /app                  0B 
      89592bae75a8        30 minutes ago      /bin/sh -c apt-get update && apt-get insta...   85.2MB 
      ... 

The next step is to remove everything that is not needed in the final image. We don't need the apt source lists anymore, so we'll glue the next line to our single `RUN` 

    .. && \ 
    rm -rf /var/lib/apt/lists/* 

Now when we build, we'll see that the size of the layer is 45.6MB megabytes. We can optimize even further by removing the `curl`. We can remove `curl` and all the dependencies it installed with 

    .. && \ 
    apt-get purge -y --auto-remove curl && \ 
    rm -rf /var/lib/apt/lists/* 

..which brings us down to 34.9MB.

Now our slimmed down container should work, but: 

    $ docker run -v "$(pwd):/app" youtube-dl https://www.youtube.com/watch?v=420UIn01VVc

      [youtube] EUHcNeg_e9g: Downloading webpage 

      ERROR: Unable to download webpage: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:661)> (caused by URLError(SSLError(1, u'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:661)'),)) 

Because `--auto-remove` also removed dependencies, like: 

    Removing ca-certificates (20170717~16.04.1) ... 

We can now see that our `youtube-dl` worked previously because of our `curl` dependencies. If `youtube-dl` would have been installed as a package, it would have declared `ca-certificates` as its dependency. 

Now what we could do is to first `purge --auto-remove` and then add `ca-certificates` back with `apt-get install` or just install `ca-certificates` along with other packages before removing `curl`:  

``` 
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

    The following additional packages will be installed: 
    openssl 

    The following NEW packages will be installed: 
    ca-certificates openssl 

and this brings us to 36.4 megabytes in our `RUN` layer (from the original 87.4 megabytes). 

**[Do exercises 3.1 and 3.2](/exercises/#31)**

## Using a non-root user ##

Our process (youtube-dl) could in theory escape the container due a bug in docker/kernel.  To mitigate this we'll add a non-root user to our container and run our process with that user. Another option would be to map the root user to a high, non-existing user id on the host with https://docs.docker.com/engine/security/userns-remap/, but this is fairly a new feature and not enabled by default.  

    && \ 
    useradd -m app 

And then we change user with the directive `USER app` - so all commands after this line will be executed as our new user, including the `CMD`. 

``` 
FROM ubuntu:16.04 

ENV LC_ALL=C.UTF-8 

RUN apt-get update && apt-get install -y \ 
    curl python ca-certificates && \ 
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl && \ 
    chmod a+x /usr/local/bin/youtube-dl && \ 
    apt-get purge -y --auto-remove curl && \ 
    rm -rf /var/lib/apt/lists/* && \ 
    useradd -m app 

USER app 

WORKDIR /app 

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
``` 

When we run this image without bind mounting our local directory: 

    $ docker run youtube-dl https://www.youtube.com/watch?v=420UIn01VVc

      [youtube] UFLCdmfGs7E: Downloading webpage 
      [youtube] UFLCdmfGs7E: Downloading video info webpage 
      [youtube] UFLCdmfGs7E: Extracting video information 
      ERROR: unable to open for writing: [Errno 13] Permission denied: 'Short introduction to Docker (Scribe)-UFLCdmfGs7E.mp4.part' 

We'll see that our `app` user can not write to `/app` - this can be fixed with `chown` or not fix it at all, if the intented usage is to always have a `/app` mounted from the host.  

**[Do exercise 3.3](/exercises/#33)**

## Alpine Linux variant ##

Our Ubuntu base image adds the most megabytes to our image (approx 113MB).  Alpine Linux provides a popular alternative base in https://hub.docker.com/_/alpine/ that is around 4 megabytes. It's based on altenative glibc implementation musl and busybox binaries, so not all software run well (or at all) with it, but our python container should run just fine. We'll create the following `Dockerfile.alpine` file:  

``` 
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

    $ docker build -t youtube-dl:alpine-3.7 -f Dockerfile.alpine . 

It seems to run fine:  

    $ docker run -v "$(pwd):/app" youtube-dl:alpine-3.7 https://www.youtube.com/watch?v=420UIn01VVc

From the history we can see that the our single `RUN` layer size is 41.1MB 

    $ docker history youtube-dl:alpine-3.7 

      IMAGE... 
      ... 
      14cfb0b531fb        20 seconds ago         /bin/sh -c apk add --no-cache curl python ca…   41.1MB 
      ... 
      <missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:093f0723fa46f6cdb…   4.15MB 

 

So in total our Alpine variant is about 45 megabytes, significantly less than our Ubuntu based image. 

Back in part 1 we published the ubuntu version of youtube-dl with tag latest.

We can publish both variants without overriding the other by publishing them with a describing tag: 

    $ docker tag youtube-dl:alpine-3.7 <username>/youtube-dl:alpine-3.7 
    $ docker push <username>/youtube-dl:alpine-3.7 

OR, if we don't want to upkeep the ubuntu version anymore we can replace our Ubuntu image by pushing this as the latest. Someone might depend on the image being ubuntu though.

    $ docker tag youtube-dl:alpine-3.7 <username>/youtube-dl 
    $ docker push <username>/youtube-dl 

Also remember that unless specified the `:latest` tag will always just refer to the latest image build & pushed - that can basically contain anything. 

**[Do exercises 3.4 and 3.5](/exercises/#34)**

## Multi-stage builds ##

Multi-stage builds are useful when you need some tools just for the build but not for the execution of the image CMD. This is an easy way to reduce size in some cases.

Let's create a website with Jekyll, build the site for production and serve the static files with nginx.
Start by creating the recipe for Jekyll to build the site.

```
FROM ruby

WORKDIR /usr/app

RUN gem install jekyll
RUN jekyll new .
RUN jekyll build
```

This creates a new Jekyll application and builds it. We could start thinking about optimizations at this point but instead we're going add a new FROM for nginx, this is what resulting image will be. And copy the built static files from the ruby image to our nginx image.

```
FROM ruby as build-stage
...
FROM nginx

COPY --from=build-stage /usr/app/_site/ /usr/share/nginx/html
```

This copies contents from the first image `/usr/app/_site/` to `/usr/share/nginx/html` Note the naming from ruby to build-stage. We could also use external image as a stage, `--from=python:3.7` for example. Lets build and check the size difference:

```
$ docker build . -t jekyll
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
jekyll              latest              5f8839505f37        37 seconds ago      109MB
ruby                latest              616c3cf5968b        28 hours ago        870MB
```

As you can see, even though our jekyll image needed ruby during the build process, its considerably smaller since it only has nginx and the static files. `docker run -it -p 8080:80 jekyll` also works as expected.

**[Do exercise 3.6](/exercises/#34)**

## A peek into multi-host environment options ##

Now that we've mastered containers in small systems with docker-compose it's time to look beyond what the tools we practiced are capable of. In situations where we have more than a single host machine we cannot use docker-compose solely. However, Docker does contain other tools to help us with automatic deployment, scaling and management of dockerized applications.

For the scope of this course we cannot go into how to use the tools in this section, but leaving them out would be a disservice.

**Docker swarm** is built into docker. It turns a pool of Docker hosts into a single virtual host. You can read the feature highlights [here](https://docs.docker.com/engine/swarm/). You can run right away with `docker swarm`. Docker swarm is the lightest way of utilizing multiple hosts.

**Kubernetes** is the de facto way of orchestrating your containers in large multi-host environments. The reason being it's customizability, large community and robust features. However the drawback is the higher learning curve compared to Docker swarms. You can read their introduction [here](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/).

The main difference you should take is that the tools are at their best in different situations. In a 2-3 host environment for a hobby project the gains from Kubernetes might not be as large compared to a environment where you need to orchestrate hundreds of hosts with multiple containers each.

But with the technology and tools being as new as they are, their popularity might fluctuate as well leading to deprecation of certain tools. A tool called docker stack has been available for a while as a way to replace docker-compose as a baked-in-to-Docker way to do the same things, with built in Kubernetes and Docker Swarm support. You can also start testing this by running `docker stack`.

![]({{ "/images/3/stack.png" | absolute_url }})

Translation:

Luukkainen: "Is docker stack the bleeding edge?"

[Paksula](/#credits): "Deprecated"

**[Do exercises 3.6 and 3.7](/exercises/#36)**
