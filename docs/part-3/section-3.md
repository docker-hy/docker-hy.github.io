---
title: 'Using a non-root user'
---

Let's get back to the youtube-dl application, that we for last time worked with it [Part 2](http://localhost:8000/part-2/1-migrating-to-docker-compose#volumes-in-docker-compose).

The application could, in theory, escape the container due to a bug in Docker or Linux kernel. To mitigate this security issue we will add a non-root user to our container and run our process with that user. Another option would be to map the root user to a high, non-existing user id on the host with https://docs.docker.com/engine/security/userns-remap/, and can be used in case you must use root within the container.

The Dockerfile that we did in [Part 1](/part-1/section-4) was this:

```dockerfile
FROM ubuntu:18.04

WORKDIR /mydir

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://github.com/ytdl-org/youtube-dl/releases/download/2021.12.17/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl

ENV LC_ALL=C.UTF-8

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

We will add an user called _appuser_ with the following command

```dockerfile
RUN useradd -m appuser
```

After that we change the user with the directive [USER](https://docs.docker.com/engine/reference/builder/#user) - so all commands after this line will be executed as our new user, including the `CMD` and `ENTRYPOINT`.

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

The `WORKDIR` is renamed to /usr/videos since it makes more sense as the videos will be downloaded there. When we run this image without bind mounting our local directory:

```console
$ docker container run youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage
  [download] Destination: Imgur-JY5tHqr.mp4
  [download] 100% of 190.20KiB in 00:0044MiB/s ETA 00:000
  ERROR: unable to open for writing: [Errno 13] Permission denied: 'Imgur-JY5tHqr.mp4.part'
```

We'll see that our `appuser` user can not write to `/usr/videos` - this can be fixed with `chown` or not fix it at all, if the intented usage is to always have a `/usr/videos` mounted from the host. By mounting the directory the application works as intended.

If we want to give the  `appuser` permission to write inside the container, the permission change must be done when we are still executing as root, that is, before the directive `USER` is used to change the user:

```dockerfile
FROM ubuntu:18.04

# ...

# create the appuser
RUN useradd -m appuser

# change the owner of current dir to appuser
RUN chown appuser .

# now we can change the user
USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

## Exercise 3.5

:::caution Mandatory Exercise 3.5

  In exercises [1.12](/part-1/section-6#exercises-111-114) and [1.13](/part-1/section-6#exercises-111-114) we created Dockerfiles for both example [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend) and [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend).

  Security issues with the user being a root are serious for the example frontend and backend as the containers for web services are supposed to be accessible through the Internet.

  Make sure the containers start their processes as a non-root user.

  Backend image is based on [Alpine Linux](https://www.alpinelinux.org/), that does not support the command `useradd`. Google will surely help you a way to create user in an `alpine` based image.

  Submit the Dockerfiles.

:::
