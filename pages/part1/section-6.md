
# Volumes: bind mount #

By **bind mounting** a host (our machine) folder to the container we can get the file directly to our machine. Let's start another run with `-v` option, that requires an absolute path. We mount our current folder as `/mydir` in our container, overwriting everything that we have put in that folder in our Dockerfile. 

```console
$ docker run -v "$(pwd):/mydir" youtube-dl https://imgur.com/JY5tHqr
```

So a volume is simply a folder (or a file) that is shared between the host machine and the container. If a file in volume is modified by a program that's running inside the container the changes are also saved from destruction when the container is shut down as the file exists on the host machine. This is the main use for volumes as otherwise all of the files wouldn't be accessible when restarting the container. Volumes also can be used to share files between containers and run programs that are able to load changed files.

In our youtube-dl we wanted to mount the whole directory since the files are fairly randomly named. If we wish to create a volume with only a single file we could also do that by pointing to it. For example `-v $(pwd)/material.md:/mydir/material.md` this way we could edit the material.md locally and have it change in the container (and vice versa). Note also that `-v` creates a directory if the file does not exist.

{% include_relative exercises/1_9.html %}

# Allowing external connections into containers #

The details on how programs communicate are not detailed in this course. Courses on Operating Systems and the Networking courses explain subjects in detail. In this course you only need to know the following simplified basics:

- Sending messages: Programs can send messages to [URL](https://en.wikipedia.org/wiki/URL) addresses such as this: http://127.0.0.1:3000 where http is the [_protocol_](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol), 127.0.0.1 is a ip address, and and 3000 is a [_port_](https://en.wikipedia.org/wiki/Port_(computer_networking)). Note the ip part could also be a [_hostname_](https://en.wikipedia.org/wiki/Hostname): 127.0.0.1 is also called [_localhost_](https://en.wikipedia.org/wiki/Localhost) so instead you could use http://localhost:3000.

- Receiving messages: Programs can be assigned to listen to any available port. If a program is listening for traffic on port 3000, and a message is sent to that port, it will receive it (and possibly process it).

The address _127.0.0.1_ and hostname _localhost_ are special ones, they refer to the machine or container itself, so if you are on a container and send message to _localhost_, the target is the same container. Similarly, if you are sending the request from outside of a container to _localhost_, the target is your machine.

You can map your host machine port to a container port.

Opening a connection from outside world to a docker container happens in two steps: 

- Exposing port

- Publishing port

Exposing a container port means that you tell Docker that the container listens to a certain port. This doesn't actually do much except helps us humans with the configuration.

Publishing a port means that Docker will map host ports to the container ports.

To expose a port, add line `EXPOSE <port>` in your Dockerfile

To publish a port, run the container with `-p <host-port>:<container-port>`

If you leave out the host port and only specify the container port, docker will automatically choose a free port as the host port:

```console
$ docker run -p 4567 app-in-port
```

We could also limit connections to certain protocol only, e.g. udp by adding the protocol at the end: `EXPOSE <port>/udp` and `-p <host-port>:<container-port>/udp`.

{% include_relative exercises/1_10.html %}

# Technology agnostic #

As we've already seen it should be possible to containerize almost any project. As we are in between Dev and Ops let's pretend again that some developer teammates of ours did an application with a README that instructs what to install and how to run the application. Now we as the container experts can containerize it in seconds. Open this `https://github.com/docker-hy/material-applications/tree/main/rails-example-project` project and read through the README and think about how to transform it into a Dockerfile. Thanks to the README we should be able to decipher what we will need to do even if we have no clue about the language or technology!

We will need to clone the repository, which you may have already done. After the project is done, let's start with a Dockerfile. We know that we need to install ruby and whatever dependencies it had. Let's place the Dockerfile in the project root.

**Dockerfile**
```Dockerfile
# We need ruby 3.0.0. I found this from docker hub
FROM ruby:3.0.0

EXPOSE 3000

WORKDIR /usr/src/app
```

Ok these are the basics, we have FROM a ruby version, EXPOSE 3000 was told at the bottom of the README and WORKDIR /usr/src/app is the convention.

```Dockerfile
# Install node, found from the internet
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt install -y nodejs

# Install yarn, found from readme
RUN npm install -g yarn

# Install the correct bundler version
RUN gem install bundler:2.2.11
```

Nodejs required a little bit of googling but that sounds promising. The next were told to us by the README. We won't need to copy anything from outside of the container to run these.

```Dockerfile
# Copy all of the content from the project to the image
COPY . .

# Install all dependencies
RUN bundle install

# We pick the production guide mode since we have no intention of developing the software inside the container.
# Run database migrations by following instructions from README
RUN rails db:migrate RAILS_ENV=production

# Precompile assets by following instructions from README
RUN rake assets:precompile 

# And finally the command to run the application
CMD ["rails", "s", "-e", "production"]
```

And finally, we copy the project, install all of the dependencies and follow the instructions in the README.

Ok. Let's see how well monkeying the README worked for us: `docker build . -t rails-project && docker run -p 3000:3000 rails-project`. After a while of waiting, the application starts in port 3000 in production mode.

{% include_relative exercises/1_11.html %}

The next three exercises will start a larger project that we will configure in parts 2 and 3. They will require you to use everything you've learned up until now.

{% include_relative exercises/1_12.html %}
{% include_relative exercises/1_13.html %}
{% include_relative exercises/1_14.html %}

# Publishing projects #

Go to <https://hub.docker.com/> to create an account. You can configure docker hub to build your images for you, but using `push` works as well.

Let's publish the youtube-dl image. Log in and navigate to your [dashboard](https://hub.docker.com/) and press Create Repository. The namespace can be either your personal account or an organization account. For now, let's stick to personal accounts and write something descriptive such as youtube-dl to repository name. We will need to remember it in part 2.

Set visibility to *public*.

And the last thing we need is to authenticate our push by logging in:

```console
$ docker login
```

Next, you will need to rename the image to include your username, and then you can push it:

```console
$ docker tag youtube-dl <username>/<repository>
  ...

$ docker push <username>/<repository>
  ...
```

{% include_relative exercises/1_15.html %}
{% include_relative exercises/1_16.html %}

