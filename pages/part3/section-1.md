
# Deeper understanding of Docker

Until now we've focused on using Docker as a tool to solve various types of problems, but meanwhile we have decided to push some of the issues until later and completely ignored others.

Every Dockerfile we've used until now has been FROM ubuntu, which is inefficient, and the user has been root, which is potentially dangerous. In addition we're still restricting ourselves into one physical computer. Unfortunately the last problem is out of our reach for this course. But we get to look at alternative solutions.

# Look into the ubuntu image

Let's look into the ubuntu image on [Docker Hub](https://hub.docker.com/r/library/ubuntu/)

The description/readme says: 

```plaintext
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

```console
$ docker image history --no-trunc ubuntu:16.04 
```

matches with the directives specified in the `Dockerfile`.  We could also build the image ourselves if we really wanted - there is nothing special in the "official" image and the build process is, as we saw, truly open. 

