---
path: '/part-3/1-deeper-understainding-of-containers'
title: 'Deeper understanding of containers'
hidden: false
---

We've focused on using Docker as a tool to solve various types of problems. Meanwhile we have decided to push some of the issues until later and completely ignored others.

The goal for this part is to look into the best practices and improve our processes.

In part 1 we talked about how alpine can be a lot smaller than Ubuntu but didn't really care about why we'd choose one above the other.
On top of that, we have been running the applications as root, which is potentially dangerous. In addition, we're still restricting ourselves to one physical computer. Unfortunately, the last problem is out of the scope of this course. But we will get to learn about different solutions.

## Look into the ubuntu image ##

Let's look into the ubuntu image on [Docker Hub](https://hub.docker.com/r/library/ubuntu/)

The description/readme says:

    What's in this image?

     This image is built from official rootfs tarballs provided by Canonical (specifically, https://partner-images.canonical.com/core/).


From the links in the Docker Hub page we can guess (not truly know) that the image is built from <https://github.com/tianon/docker-brew-ubuntu-core> - So from a repository owned by a person named "Tianon Gravi".

In that git repository's [README](https://github.com/tianon/docker-brew-ubuntu-core/tree/master#scripts-to-prepare-updates-to-the-ubuntu-official-docker-images) as step 7 it says:

    Some more Jenkins happens

This step implies that somewhere there is a Jenkins server that runs this script, builds the image, and publishes the image to the registry - we have no way of knowing if this is true or not.

Let's see the Dockerfile of <https://hub.docker.com/r/_/ubuntu/> by clicking the 18.04 [Dockerfile link](https://github.com/tianon/docker-brew-ubuntu-core/blob/490e0e86ec5c93524b7ae37b79025e5ded5efcc6/bionic/Dockerfile).

The first line states that the image starts FROM a **special** image "scratch" that is just empty. Then a file `ubuntu-bionic-core-cloudimg-amd64-root.tar.gz` is added to the root from the same [directory](https://github.com/tianon/docker-brew-ubuntu-core/tree/490e0e86ec5c93524b7ae37b79025e5ded5efcc6/bionic).

This file should be the "..official rootfs tarballs provided by Canonical" mentioned earlier, but it's not actually coming from [canonical](https://partner-images.canonical.com/core/bionic/current/), it is copied from repo owned by "tianon". We could verify the checksums of the file if we were interested.

Notice how the file is not extracted at any point. The `ADD` instruction [documentation](https://docs.docker.com/engine/reference/builder/#add) states that "If src is a local tar archive in a recognized compression format (identity, gzip, bzip2 or xz) then it is unpacked as a directory. "

Before getting stressed by the potential security problems with this, we have to remind ourselves:

    "You can't trust code that you did not totally create yourself." - Ken Thompson (1984, Reflections on Trusting Trust).

However, we will assume that the `ubuntu:18.04` that we downloaded is this image. The command `image history` supports us:

```console
$ docker image history --no-trunc ubuntu:18.04
```

The output from image history matches with the directives specified in the Dockerfile. In case this isn't enough, we could also build the image ourselves. The build process is, as we saw, truly open, and there is nothing that makes the "official" image special.

