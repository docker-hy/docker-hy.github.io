---
path: "/part-1/3-in-depth-dive-to-images"
title: "In-depth dive to images"
hidden: false
---

Images are the basic building blocks for containers and other images. When you "containerize" an application you work towards creating the image.

By learning what images are and how to create them you are ready to start utilizing containers in your own projects.

## Where do the images come from?

When running a command such as `docker run hello-world`, Docker will automatically search [Docker Hub](https://hub.docker.com/) for the image if it is not found locally.

This means that we can pull and run any public image from Docker's servers. For example‚ if we wanted to start an instance of the PostgreSQL database, we could just run `docker run postgres`, which would pull and run [https://hub.docker.com/\_/postgres/](https://hub.docker.com/_/postgres/).

We can search for images in the Docker Hub with `docker search`. Try running `docker search hello-world`.

The search finds plenty of results, and prints each image's name, short description, amount of stars, and "official" and "automated" statuses.

```console
$ docker search hello-world

  NAME                         DESCRIPTION    STARS   OFFICIAL   AUTOMATED
  hello-world                  Hello World!…  699     [OK]
  kitematic/hello-world-nginx  A light-weig…  112
  tutum/hello-world            Image to tes…  56                 [OK]
  ...
```

Let's examine the list.

The first result, `hello-world`, is an official image. [Official images](https://docs.docker.com/docker-hub/official_images/) are curated and reviewed by Docker, Inc. and are usually actively maintained by the authors. They are built from repositories in the [docker-library](https://github.com/docker-library).

When browsing the CLI's search results, you can recognize an official image from the "[OK]" in the "OFFICIAL" column and also from the fact that the image's name has no prefix (aka organization/user). When browsing Docker Hub, the page will show "Docker Official Images" as the repository, instead of a user or organization. For example, see the [Docker Hub page](https://hub.docker.com/_/hello-world/) of the `hello-world` image.

The third result, `tutum/hello-world`, is marked as "automated". This means that the image is [automatically built](https://docs.docker.com/docker-hub/builds/) from the source repository. Its [Docker Hub page](https://hub.docker.com/r/tutum/hello-world/) shows its previous "Builds" and a link to the image's "Source Repository" (in this case, to GitHub) from which Docker Hub builds the image.

The second result, `kitematic/hello-world-nginx`, is neither an official nor an automated image.
We can't know what the image is built from, since its [Docker Hub page](https://hub.docker.com/r/kitematic/hello-world-nginx/) has no links to any repositories. The only thing its Docker Hub page reveals is that the image is 6 years old. Even if the image's "Overview" section had links to a repository, we would have no guarantees that the published image was built from that source.

There are also other Docker registries competing with Docker Hub, such as [quay](https://quay.io/). However, `docker search` will only search from Docker Hub, so we will need to use the registry's web pages to search for images. Take a look at the page of [the `nordstrom/hello-world` image on quay](https://quay.io/repository/nordstrom/hello-world). The page shows the command to use to pull the image, which reveals that we can also pull images from hosts other than Docker Hub:

`docker pull quay.io/nordstrom/hello-world`

So, if the host's name (here: `quay.io`) is omitted, it will pull from Docker Hub by default.

NOTE: Trying above command may fail giving manifest errors as default tag latest is not present in quay.io/nordstrom/hello-world image. Specifying correct tag for image will pull image without any errors, for ex.
`docker pull quay.io/nordstrom/hello-world:2.0`

## A detailed look into an image

Let's go back to a more relevant image than 'hello-world', the ubuntu image is one of the most common Docker images to use as a base for your own image.

Let's pull Ubuntu and look at the first lines:

```console
$ docker pull ubuntu
  Using default tag: latest
  latest: Pulling from library/ubuntu
```

Since we didn't specify a tag, Docker defaulted to `latest`, which is usually the latest image built and pushed to the registry. **However**, in this case, the repository's README says that the `ubuntu:latest` tag points to the "latest LTS" instead since that's the version recommended for general use.

Images can be tagged to save different versions of the same image. You define an image's tag by adding `:<tag>` after the image's name.

Ubuntu's [Docker Hub page](https://hub.docker.com/r/library/ubuntu/tags/) reveals that there's a tag named 18.04 which promises us that the image is based on Ubuntu 18.04. Let's pull that as well:

```console
$ docker pull ubuntu:18.04

  18.04: Pulling from library/ubuntu
  c2ca09a1934b: Downloading [============================================>      ]  34.25MB/38.64MB
  d6c3619d2153: Download complete
  0efe07335a04: Download complete
  6b1bb01b3a3b: Download complete
  43a98c187399: Download complete
```

Images are composed of different layers that are downloaded in parallel to speed up the download. Images being made of layers also have other aspects and we will talk about them in part 3.

We can also tag images locally for convenience, for example, `docker tag ubuntu:18.04 ubuntu:bionic` creates the tag `ubuntu:bionic` which refers to `ubuntu:18.04`.

Tagging is also a way to "rename" images. Run `docker tag ubuntu:18.04 fav_distro:bionic` and check `docker images` to see what effects the command had.

To summarize, an image name may consist of 3 parts plus a tag. Usually like the following: `registry/organisation/image:tag`. But may be as short as `ubuntu`, then the registry will default to docker hub, organisation to _library_ and tag to _latest_. The organisation may also be an user, but calling it an organisation may be more clear.

<exercise name="Exercise 1.5: Sizes of images">

In a previous exercise we used `devopsdockeruh/simple-web-service:ubuntu`.

Here is the same application but instead of ubuntu is using alpine: `devopsdockeruh/simple-web-service:alpine`.

Pull both images and compare the image sizes.
Go inside the alpine container and make sure the secret message functionality is the same. Alpine version doesn't have bash but it has sh.

</exercise>

<exercise name="Exercise 1.6: Hello Docker Hub">

Run `docker run -it devopsdockeruh/pull_exercise`.

It will wait for your input. Navigate through docker hub to find the docs and Dockerfile that was used to create the
image.

Read the Dockerfile and/or docs to learn what input will get the application to answer a "secret message".

Submit the secret message and command(s) given to get it as your answer.

</exercise>

# Building images

Finally, we get to build our own images and get to talk about [`Dockerfile`](https://docs.docker.com/engine/reference/builder/) and why it's so great.

Dockerfile is simply a file that contains the build instructions for an image. You define what should be included in the image with different instructions. We'll learn about the best practices here by creating one.

Let's take a most simple application and containerize it first. Here is a script called "hello.sh"

**hello.sh**

```sh
#!/bin/sh

echo "Hello, docker!"
```

First, we will test that it even works. Create the file, add execution permissions and run it:

```console
$ chmod +x hello.sh

$ ./hello.sh
  Hello, docker!
```

* If you're using windows you can skip these two and add chmod +x hello.sh to the Dockerfile.

And now to create an image from it. We'll have to create the Dockerfile that declares all of the required dependencies. At least it depends on something that can run shell scripts. So I will choose alpine, it is a small Linux distribution and often used to create small images.

Even though we're using alpine here, you can use ubuntu during exercises. Ubuntu images by default contain more tools to debug what is wrong when something doesn't work. In part 3 we will talk more about why small images are important.

We will choose exactly which version of a given image we want to use. This makes it so that we don't accidentally update through a breaking change, and we know which images need updating when there are known security vulnerabilities in old images.

Now create a file and name it "Dockerfile" and lets put the following instructions inside it:

**Dockerfile**

```Dockerfile
# Start from the alpine image that is smaller but no fancy tools
FROM alpine:3.13

# Use /usr/src/app as our workdir. The following instructions will be executed in this location.
WORKDIR /usr/src/app

# Copy the hello.sh file from this location to /usr/src/app/ creating /usr/src/app/hello.sh
COPY hello.sh .

# Alternatively, if we skipped chmod earlier, we can add execution permissions during the build.
# RUN chmod +x hello.sh

# When running docker run the command will be ./hello.sh
CMD ./hello.sh
```

<text-box name="Permission denied" variant="hint">

If you're now getting "/bin/sh: ./hello.sh: Permission denied" it's because the `chmod +x hello.sh` was skipped earlier. You can simply uncomment the RUN instruction between COPY and CMD instructions

</text-box>

Great! By default `docker build` will look for a file named Dockerfile. Now we can run `docker build` with instructions where to build (`.`) and give it a name (`-t <name>`):

```console
$ docker build . -t hello-docker
  Sending build context to Docker daemon  54.78kB
  Step 1/4 : FROM alpine:3.13
   ---> d6e46aa2470d
  Step 2/4 : WORKDIR /usr/src/app
   ---> Running in bd0b4e349cb4
  Removing intermediate container bd0b4e349cb4
   ---> b382ca27c182
  Step 3/4 : COPY hello.sh .
   ---> 7fbc1b6e45ab
  Step 4/4 : CMD ./hello.sh
   ---> Running in 24f28f026b3f
  Removing intermediate container 24f28f026b3f
   ---> 444f21cf7bd5
  Successfully built 444f21cf7bd5
  Successfully tagged hello-docker:latest

$ docker images
  REPOSITORY            TAG          IMAGE ID       CREATED         SIZE
  hello-docker          latest       444f21cf7bd5   2 minutes ago   5.57MB
```

Now executing the application is as simple as running `docker run hello-docker`. Try it! During the build we see that there are multiple steps with hashes and intermediate containers. The steps here represent the layers so that each step is a new layer to the image.

The **layers** have multiple functions. We often try to limit the number of layers to save on storage space but layers can work as a cache during build time. If we just edit the last lines of Dockerfile the build command can start from the previous layer and skip straight to the section that has changed. COPY automatically detects changes in the files, so if we change the hello.sh it'll run from step 3/4, skipping 1 and 2. This can be used to create faster build pipelines. We'll talk more about optimization in part 3.

The intermediate containers are containers created from the image in which the command is executed. Then the changed state is stored into an image. We can do similiar task and a new layer manually. Create a new file called `additional.txt` and let's copy it inside the container and learn new trick while we're at it! We'll need two terminals so I will label the lines with 1 and 2 representing the two.

```console
1 $ docker run -it hello-docker sh
1 /usr/src/app #
```

Now we're inside of the container. We replaced the CMD we defined earlier with `sh` and used -i and -t to start the container so that we can interact with it. In the second terminal we will copy the file here.

```console
2 $ docker ps
2   CONTAINER ID   IMAGE          COMMAND   CREATED         STATUS         PORTS     NAMES
    9c06b95e3e85   hello-docker   "sh"      4 minutes ago   Up 4 minutes             zen_rosalind

2 $ touch additional.txt
2 $ docker cp ./additional.txt zen_rosalind:/usr/src/app/
```

I created the file with touch right before copying it in. Now it's there and we can confirm that with ls:

```console
1 /usr/src/app # ls
1 additional.txt  hello.sh
```

Great! Now we've made a change to the container. We can use `diff` to check what has changed

```console
2 $ docker diff zen_rosalind
    C /usr
    C /usr/src
    C /usr/src/app
    A /usr/src/app/additional.txt
    C /root
    A /root/.ash_history
```

The character in front of the file name indicates the type of the change in the container's filesystem: A = added, D = deleted, C = changed. The additional.txt was created and our `ls` created .ash_history. Next we will save the changes as a new layer!

```console
2 $ docker commit zen_rosalind hello-docker-additional
    sha256:2f63baa355ce5976bf89fe6000b92717f25dd91172aed716208e784315bfc4fd
2 $ docker images
    REPOSITORY                   TAG          IMAGE ID       CREATED          SIZE
    hello-docker-additional      latest       2f63baa355ce   3 seconds ago    5.57MB
    hello-docker                 latest       444f21cf7bd5   31 minutes ago   5.57MB
```

We will actually never use docker commit again. This is because defining the changes to the Dockerfile is much more sustainable method of managing changes. No magic actions or scripts, just a Dockerfile that can be version controlled.

Let's do just that and create hello-docker with v2 tag that includes additional.txt.

**Dockerfile**

```Dockerfile
# Start from the alpine image
FROM alpine:3.13

# Use /usr/src/app as our workdir. The following instructions will be executed in this location.
WORKDIR /usr/src/app

# Copy the hello.sh file from this location to /usr/src/app/ creating /usr/src/app/hello.sh.
COPY hello.sh .

# Execute a command with `/bin/sh -c` prefix.
RUN touch additional.txt

# When running docker run the command will be ./hello.sh
CMD ./hello.sh
```

Build it with `docker build . -t hello-docker:v2` and we are done! Let's compare the output of ls:

```
$ docker run hello-docker-additional ls
  additional.txt
  hello.sh

$ docker run hello-docker:v2 ls
  additional.txt
  hello.sh
```

Now we know that all instructions in a Dockerfile **except** CMD (and one other that we will learn about soon) are executed during build time. **CMD** is executed when we call docker run, unless we overwrite it.

<exercise name="Exercise 1.7: Two line Dockerfile">

By default our `devopsdockeruh/simple-web-service:alpine` doesn't have a CMD. It instead uses _ENTRYPOINT_ to declare which application is run.

We'll talk more about _ENTRYPOINT_ in the next section, but you already know that the last argument in `docker run` can be used to give command.

As you might've noticed it doesn't start the web service even though the name is "simple-web-service". A command is needed to start the server!

Try `docker run devopsdockeruh/simple-web-service:alpine hello`. The application reads the argument but will inform that hello isn't accepted.

In this exercise create a Dockerfile and use FROM and CMD to create a brand new image that automatically runs the server.
Tag the new image as "web-server"

Return the Dockerfile and the command you used to run the container.

Running the built "web-server" image should look like this:

```console
$ docker run web-server
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
- using env:   export GIN_MODE=release
- using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /*path                    --> server.Start.func1 (3 handlers)
[GIN-debug] Listening and serving HTTP on :8080
```

* We don't have any method of accessing the web service yet. As such confirming that the console output is the same will suffice.

* The exercise title may be an useful hint here.

</exercise>

<exercise name="Exercise 1.8: Image for script">

We can improve our previous solutions now that we know how to create and build a Dockerfile.

Create a new file on your local machine with and append the script we used previously into that file

```
echo "Input website:"; read website; echo "Searching.."; sleep 1; curl http://$website;
```

Create a Dockerfile for a new image that starts from ubuntu:20.04 and add instructions to install curl into that image. Then add instructions to copy the script file into that image and finally set it to run on container start using CMD.

After you have filled the Dockerfile, build the image with the tag "curler".

* If you are getting permission denied, use `chmod` to give permission to run the script.

The following should now work:

```bash
$ docker run -it curler

  Input website:
  helsinki.fi
  Searching..
  <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
  <html><head>
  <title>301 Moved Permanently</title>
  </head><body>
  <h1>Moved Permanently</h1>
  <p>The document has moved <a href="https://www.helsinki.fi/">here</a>.</p>
  </body></html>
```

Submit the Dockerfile.

</exercise>
