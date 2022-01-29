---
path: '/part-3/3-using-non-root-user'
title: 'Using a non-root user'
hidden: false
---

Let's go back to our youtube-dl application. The application could, in theory, escape the container due to a bug in docker/kernel. To mitigate this security issue we will add a non-root user to our container and run our process with that user. Another option would be to map the root user to a high, non-existing user id on the host with https://docs.docker.com/engine/security/userns-remap/, and can be used in case you must use root within the container.

Our status from the previous part was this:

```dockerfile
FROM ubuntu:18.04

WORKDIR /mydir

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl

ENV LC_ALL=C.UTF-8

ENTRYPOINT ["/usr/local/bin/youtube-dl"]
```

We will add an user "appuser" with

```dockerfile
RUN useradd -m appuser
```

And then we change user with the directive `USER` - so all commands after this line will be executed as our new user, including the `CMD`.

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

I also renamed the WORKDIR to /usr/videos since it makes more sense as the videos will be downloaded there. When we run this image without bind mounting our local directory:

```console
$ docker container run youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage
  [download] Destination: Imgur-JY5tHqr.mp4
  [download] 100% of 190.20KiB in 00:0044MiB/s ETA 00:000
  ERROR: unable to open for writing: [Errno 13] Permission denied: 'Imgur-JY5tHqr.mp4.part'
```

We'll see that our `appuser` user can not write to `/usr/videos` - this can be fixed with `chown` or not fix it at all, if the intented usage is to always have a `/usr/videos` mounted from the host. By mounting the directory the application works as intended.

<exercise name="Exercise 3.3">

  <b style="color:firebrick;">This exercise is mandatory</b>

  In the previous parts we created Dockerfiles for both example [frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend) and [backend](https://github.com/docker-hy/material-applications/tree/main/example-backend).

  Security issues with the user being a root are serious for the example frontend and backend as the containers for web
  services are supposed to be accessible through the internet.

  Make sure the containers start their processes as a non-root user.

  > TIP `man chown` may help you if you have access errors

</exercise>
