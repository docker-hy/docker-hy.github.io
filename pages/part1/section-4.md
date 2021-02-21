# Building images #

Finally, we get to build our own images and get to talk about [`Dockerfile`](https://docs.docker.com/engine/reference/builder/) and why it's so great.

Dockerfile is simply a file that contains the build instructions for an image. You define what should be included in the image with different instructions. We'll learn about the best practices here by creating one.ß

Let's take a most simple application and containerize it first. Here is a script called "hello.sh"

**hello.sh**
```bash
#!/bin/sh

echo "Hello, docker!"
```

First test that it works on any machine. Create the file, add execution permissions and run it:

```console
$ chmod +x hello.sh

$ ./hello.sh
  Hello, docker!
```

And now to create an image from it. We'll have to create the Dockerfile that declares all of the required dependencies. At least it depends on something that can run shell scripts. So I will choose alpine, its a small linux and often used to create small images. In part 3 we will talk more about why small images are important.

Let's create a Dockerfile with the following contents

**Dockerfile**
```Dockerfile
# Start from the alpine image that is smaller but no fancy tools
FROM alpine

# Use /usr/src/app as our workdir. The following instructions will be executed in this location.
WORKDIR /usr/src/app

# Copy the hello.sh file from this location to /usr/src/app/ creating /usr/src/app/hello.sh
COPY hello.sh .

# When running docker run the command will be ./hello.sh
CMD ./hello.sh
```

Great! Now we can run `docker build` with instructions where to build (`.`) and give it a name (`-t <name>`):

```console
$ docker build . -t hello-docker
  Sending build context to Docker daemon  54.78kB
  Step 1/4 : FROM alpine
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

Now we're inside of the container. We replaced the CMD we defined earlier with `sh` and used -i and -t to start the container so that we can interact with it. In the second terminal we'll copy the file here.

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
FROM alpine

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

{% include_relative exercises/1_7.html %}
{% include_relative exercises/1_8.html %}