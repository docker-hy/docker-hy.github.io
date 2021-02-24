## Using a non-root user ##

Our process (youtube-dl) could in theory escape the container due to a bug in docker/kernel.  To mitigate this we'll add a non-root user to our container and run our process with that user. Another option would be to map the root user to a high, non-existing user id on the host with https://docs.docker.com/engine/security/userns-remap/, but this is fairly a new feature and not enabled by default.  

```console
&& \ 
useradd -m app 
```

And then we change user with the directive `USER app` - so all commands after this line will be executed as our new user, including the `CMD`. 

```dockerfile
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

```console
$ docker container run youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage
  [download] Destination: Imgur-JY5tHqr.mp4
  [download] 100% of 190.20KiB in 00:0044MiB/s ETA 00:000
  ERROR: unable to open for writing: [Errno 13] Permission denied: 'Imgur-JY5tHqr.mp4.part'
```

We'll see that our `app` user can not write to `/app` - this can be fixed with `chown` or not fix it at all, if the intented usage is to always have a `/app` mounted from the host.  

{% include_relative exercises/3_4.html %}
