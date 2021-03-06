# Using a non-root user #

Let's go back to our youtube-dl application. The application could, in theory, escape the container due to a bug in docker/kernel. To mitigate this security issue we will add a non-root user to our container and run our process with that user. Another option would be to map the root user to a high, non-existing user id on the host with https://docs.docker.com/engine/security/userns-remap/, and can be used in case you must use root within the container.

Our status from the previous part was this:

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

We will add an user "appuser" with

```dockerfile
RUN useradd -m appuser 
```

And then we change user with the directive `USER` - so all commands after this line will be executed as our new user, including the `CMD`. 

```dockerfile
FROM ubuntu:16.04 

WORKDIR /usr/app

ENV LC_ALL=C.UTF-8 

RUN apt-get update
RUN apt-get install -y curl python
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+x /usr/local/bin/youtube-dl
RUN useradd -m appuser

USER appuser

ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
``` 

When we run this image without bind mounting our local directory: 

```console
$ docker container run youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage
  [download] Destination: Imgur-JY5tHqr.mp4
  [download] 100% of 190.20KiB in 00:0044MiB/s ETA 00:000
  ERROR: unable to open for writing: [Errno 13] Permission denied: 'Imgur-JY5tHqr.mp4.part'
```

We'll see that our `appuser` user can not write to `/usr/app` - this can be fixed with `chown` or not fix it at all, if the intented usage is to always have a `/usr/app` mounted from the host.

{% include_relative exercises/3_4.html %}
