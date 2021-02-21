# More complex image #

Next, we will start moving towards a more meaningful image. _youtube-dl_ is a program that downloads youtube videos <https://rg3.github.io/youtube-dl/download.html>. Let's add it to an image - but this time instead of doing it directly in Dockerfile. Instead of our current process where we add things to the Dockerfile hope it works, let's try another approach. This time we will open up an interactive session and test stuff before "storing" it in our Dockerfile. By following the youtube-dl install instructions we will see that:

```console
$ docker run -it myfirst 
  root@8c587232a608:/mydir# sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl 
  bash: sudo: command not found 
```

`sudo` is not installed, but since we are `root` we don't need it now, so let's try again without... 

```console
root@8c587232a608:/mydir# curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl 
bash: curl: command not found 
```

..and we see that curl is not installed either - we could just revert to use `wget`, but as an exercise, let's add `curl` with `apt-get` since we already have the apt sources in our image (that hopefully are still valid) 

```console
$ apt-get install -y curl 
$ curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl 
```

Then we'll add permissions and run it: 

```console
$ chmod a+rx /usr/local/bin/youtube-dl 
$ youtube-dl
  /usr/bin/env: 'python': No such file or directory 
```

Okay - On the top of the `youtube-dl` download page we'll notice this message:

> Remember youtube-dl requires Python version 2.6, 2.7, or 3.2+ to work except for Windows exe.

So let's add python 

```console
$ apt-get install -y python 
```

And let's run it again 

```console
$ youtube-dl 

  WARNING: Assuming --restrict-filenames since file system encoding cannot encode all characters. Set the LC_ALL environment variable to fix this. 
  Usage: youtube-dl [OPTIONS] URL [URL...] 

  youtube-dl: error: You must provide at least one URL. 
  Type youtube-dl --help to see a list of all options. 
```

It works (we just need to give an URL), but we notice that it outputs a warning about `LC_ALL`. In a regular Ubuntu desktop/server install the localization settings are (usually) set, but in this image they are not set, as we can see by running `env` in our container. To fix this without installing additional locales, see this: <https://stackoverflow.com/a/41648500>

```console
$ LC_ALL=C.UTF-8 youtube-dl 
```

And it works! Let's persist it for our session and try downloading a video: 

```console
$ export LC_ALL=C.UTF-8 
$ youtube-dl https://imgur.com/JY5tHqr
```

So now when we know what do, let's add these to the bottom of our `Dockerfile` - by adding the instructions to the bottom we preserve our cached layers - this is handy practise to speed up creating the initial version of a Dockerfile when it has time consuming operations like downloads. 

```dockerfile
... 
RUN apt-get update && apt-get install -y curl python 
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl 
RUN chmod a+x /usr/local/bin/youtube-dl 
ENV LC_ALL=C.UTF-8 
CMD ["/usr/local/bin/youtube-dl"] 
```

- Instead of using `RUN export LC_ALL=C.UTF-8` we'll store the environment directly in the image with ENV 

- We'll also override `bash` as our image command (set on the base image) with _youtube-dl_ itself. This will not work, but let's see why. 

When we build this as youtube-dl and run it:
```console
$ docker build -t youtube-dl . 
  ...

$ docker run youtube-dl 

  Usage: youtube-dl [OPTIONS] URL [URL...] 

  youtube-dl: error: You must provide at least one URL. 

  Type youtube-dl --help to see a list of all options. 
```

So far so good, but now the natural way to use this image would be to give the URL as an argument: 

```console
$ docker run youtube-dl https://imgur.com/JY5tHqr 

  /usr/local/bin/docker: Error response from daemon: OCI runtime create failed: container_linux.go:296: starting container process caused "exec: \"https://imgur.com/JY5tHqr\": stat https://imgur.com/JY5tHqr: no such file or directory": unknown. 

  ERRO[0001] error waiting for container: context canceled 
```

As we now know the argument we gave it is actually replacing the command or `CMD`. We need a way to have something before the command. Luckily we have a way to do this: we can use `ENTRYPOINT` to define the main executable and then docker will combine our run arguments for it. 

```dockerfile
ENTRYPOINT ["/usr/local/bin/youtube-dl"] 
```
And now it works like it should: 

```console
$ docker build -t youtube-dl . 
$ docker run youtube-dl https://imgur.com/JY5tHqr

  [Imgur] JY5tHqr: Downloading webpage
  [download] Destination: Imgur-JY5tHqr.mp4
  [download] 100% of 190.20KiB in 00:0044MiB/s ETA 00:000
```

With the ENTRYPOINT this now ran `/usr/local/bin/youtube-dl https://imgur.com/JY5tHqr` when we started the image with that command!

`ENTRYPOINT` vs `CMD` can be confusing - in a properly set up image such as our youtube-dl the command represents an argument list for the entrypoint. By default entrypoint is set as `/bin/sh` and this is passed if no entrypoint is set. This is why giving path to a script file as CMD works: you're giving the file as a parameter to `/bin/sh`.

In addition, there are two ways to set them: **exec** form and **shell** form. We've been using the exec form where the command itself is executed. In shell form the command that is executed is wrapped with `/bin/sh -c` - it's useful when you need to evaluate environment variables in the command like `$MYSQL_PASSWORD` or similar. 

In the shell form the command is provided as a string without brackets. In the exec form the command and it's arguments are provided as a list (with brackets), see the table below: 

|Dockerfile | Resulting command|
|---|---|
|ENTRYPOINT /bin/ping -c 3 <br> CMD localhost | /bin/sh -c '/bin/ping -c 3' /bin/sh -c localhost |
|ENTRYPOINT ["/bin/ping","-c","3"] <br> CMD localhost | /bin/ping -c 3 /bin/sh -c localhost |
|ENTRYPOINT /bin/ping -c 3 <br> CMD ["localhost"] | /bin/sh -c '/bin/ping -c 3' localhost |
|ENTRYPOINT ["/bin/ping","-c","3"] <br> CMD ["localhost"] | /bin/ping -c 3 localhost | 

As the command at the end of docker run will be the CMD we want to use ENTRYPOINT to specify what to run, and CMD to specify which command (in our case url) to run. 

**Most of the time** we can ignore ENTRYPOINT when building our images and only use CMD. For example, ubuntu image defaults the ENTRYPOINT to bash so we don't have to worry about it. And it gives us the convenience of allowing us to overwrite the CMD easily, for example, with bash to go inside the container.

We can test how some other projects do this. Let's try python:

```console
$ docker pull python:3.8
...
$ docker run -it python:3.8
  Python 3.8.2 (default, Mar 31 2020, 15:23:55)
  [GCC 8.3.0] on linux
  Type "help", "copyright", "credits" or "license" for more information.
  >>> print("Hello, World!")
  Hello, World!
  >>> exit()

$ docker run -it python:3.8 --version
  docker: Error response from daemon: OCI runtime create failed: container_linux.go:370: starting container process caused: exec: "--version": executable file not found in $PATH: unknown.

$ docker run -it python:3.8 bash
  root@1b7b99ae2f40:/#

```

From this experimentation we learned that they have ENTRYPOINT as something other than python, but the CMD is python and we can overwrite it, here with bash. If they had ENTRYPOINT as python we'd be able to run --version. We can create our own image for personal use as we did in a previous exercise with a new Dockerfile.

```dockerfile
FROM python:3.8
ENTRYPOINT ["python3"]
CMD ["--help"]
```

The result is an image that has python as ENTRYPOINT and you can add the commands at the end, for example --version to see the version. Without overwriting the command, it will output the help.

Now we have two problems with the youtube-dl project: 

- Major: The downloaded files stay in the container 

- Minor: Our container build process creates many layers resulting in increased image size 

Let's fix the bigger issue first. We will look at the minor issue in part 3.

By inspecting `docker container ls -a` we can see all our previous runs. When we filter this list with 

```console
$ docker container ls -a --last 3 

  CONTAINER ID        IMAGE               COMMAND                   CREATED                  STATUS                          PORTS               NAMES 
  be9fdbcafb23        youtube-dl          "/usr/local/bin/yout…"    Less than a second ago   Exited (0) About a minute ago                       determined_elion 
  b61e4029f997        f2210c2591a1        "/bin/sh -c \"/usr/lo…"   Less than a second ago   Exited (2) About a minute ago                       vigorous_bardeen 
  326bb4f5af1e        f2210c2591a1        "/bin/sh -c \"/usr/lo…"   About a minute ago       Exited (2) 3 minutes ago                            hardcore_carson 
```
 
We see that the last container was `be9fdbcafb23` or `determined_elion` for us humans. 

```console
$ docker diff determined_elion 

  C /mydir 
  A /mydir/Imgur-JY5tHqr.mp4 
```

Let's try `docker cp` command to copy the file. We can use quotes if the filename has spaces.

```console
$ docker cp "determined_elion://mydir/Imgur-JY5tHqr.mp4" . 
```

And now we have our file locally. This does not really fix our issue, so let's continue: 
