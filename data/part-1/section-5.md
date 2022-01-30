---
path: "/part-1/5-volumes-and-ports"
title: "Interacting with the container via volumes and ports"
hidden: false
---

We can use volumes to make it easier to store the downloads outside the containers ephemeral storage. With **bind mount** we can mount a file or directory from our own machine into the container. Let's start another container with `-v` option, that requires an absolute path. We mount our current folder as `/mydir` in our container, overwriting everything that we have put in that folder in our Dockerfile.

```console
$ docker run -v "$(pwd):/mydir" youtube-dl https://imgur.com/JY5tHqr
```

So a volume is simply a folder (or a file) that is shared between the host machine and the container. If a file in volume is modified by a program that's running inside the container the changes are also saved from destruction when the container is shut down as the file exists on the host machine. This is the main use for volumes as otherwise all of the files wouldn't be accessible when restarting the container. Volumes also can be used to share files between containers and run programs that are able to load changed files.

In our youtube-dl we wanted to mount the whole directory since the files are fairly randomly named. If we wish to create a volume with only a single file we could also do that by pointing to it. For example `-v $(pwd)/material.md:/mydir/material.md` this way we could edit the material.md locally and have it change in the container (and vice versa). Note also that `-v` creates a directory if the file does not exist.

<exercise name="Exercise 1.9: Volumes">

In this exercise we won't create a new Dockerfile.

Image `devopsdockeruh/simple-web-service` creates a timestamp every two seconds to `/usr/src/app/text.log` when it's not given a command. Start the
container with bind mount so that the logs are created into your filesystem.

Submit the command you used to complete the exercise.

</exercise>

# Allowing external connections into containers

The details on how programs communicate are not detailed in this course. Courses on Operating Systems and the Networking courses explain subjects in detail. In this course you only need to know the following simplified basics:

- Sending messages: Programs can send messages to [URL](https://en.wikipedia.org/wiki/URL) addresses such as this: http://127.0.0.1:3000 where http is the [_protocol_](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol), 127.0.0.1 is a ip address, and and 3000 is a [_port_](<https://en.wikipedia.org/wiki/Port_(computer_networking)>). Note the ip part could also be a [_hostname_](https://en.wikipedia.org/wiki/Hostname): 127.0.0.1 is also called [_localhost_](https://en.wikipedia.org/wiki/Localhost) so instead you could use http://localhost:3000.

- Receiving messages: Programs can be assigned to listen to any available port. If a program is listening for traffic on port 3000, and a message is sent to that port, it will receive it (and possibly process it).

The address _127.0.0.1_ and hostname _localhost_ are special ones, they refer to the machine or container itself, so if you are on a container and send message to _localhost_, the target is the same container. Similarly, if you are sending the request from outside of a container to _localhost_, the target is your machine.

You can map your host machine port to a container port.

Opening a connection from outside world to a docker container happens in two steps:

- Exposing port

- Publishing port

Exposing a container port means telling Docker that the container listens to a certain port. This doesn't do much, except it helps humans with the configuration.

Publishing a port means that Docker will map host ports to the container ports.

To expose a port, add the line `EXPOSE <port>` in your Dockerfile

To publish a port, run the container with `-p <host-port>:<container-port>`

If you leave out the host port and only specify the container port, docker will automatically choose a free port as the host port:

```console
$ docker run -p 4567 app-in-port
```

We could also limit connections to certain protocol only, e.g. udp by adding the protocol at the end: `EXPOSE <port>/udp` and `-p <host-port>:<container-port>/udp`.

<text-box name="Security reminder: Opening a door to the internet" variant="hint">

Since we are opening a port to the application, anyone from the internet could come in and access what you're running.

Don't haphazardly open just any ports - a way for an attacker to get in is by exploiting a port you opened to an insecure server. An easy way to avoid this is by defining the host-side port like this `-p 127.0.0.1:3456:3000`. This will only allow requests from your computer through port 3456 to the application port 3000, with no outside access allowed.

The short syntax, `-p 3456:3000`, will result in the same as `-p 0.0.0.0:3456:3000`, which truly is opening the port to everyone.

Usually, this isn't risky. But depending on the application, it is something you should consider!

</text-box>

<exercise name="Exercise 1.10: Ports open">

In this exercise, we won't create a new Dockerfile.

The image `devopsdockeruh/simple-web-service` will start a web service in port `8080` when given the command "server". From 1.7 you should have an image ready for this. Use -p flag to access the contents with
your browser. The output to your browser should be something like:
`{ message: "You connected to the following path: ...`

Submit your used commands for this exercise.

</exercise>
