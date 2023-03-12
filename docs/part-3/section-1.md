---
title: "Official Images and trust"
---

We've focused on using Docker as a tool to solve various types of problems. Meanwhile we have decided to push some of the issues until later and completely ignored others.

The goal for this part is to look into some of the best container practices and improve our processes.

In [part 1](/part-1/section-3#exercises-15---16) we talked about how [Alpine Linux](https://www.alpinelinux.org/) image can be quite a bit than Ubuntu but didn't really care about why we'd choose one above the other. On top of that, we have been running the applications as [root](https://en.wikipedia.org/wiki/Superuser), i.e. the super user, which is potentially dangerous.

## Look into official images

Which version is considered to be the "official" version is up to the maintainers of [Docker Official Images](https://github.com/docker-library/official-images) to decide. The official images [repository](https://github.com/docker-library/official-images) contains a library of images considered official. They are introduced into the library by regular pull request processes. The extended process for verifying an image is described in the repository README.

Many of the most well known projects are maintained under the [docker-library](https://github.com/docker-library) organization. Those include images such as Postgres and Python. But many of them are added to the library, but are maintained in a separate organization, such as Ubuntu and [Nodejs](https://github.com/nodejs/docker-node).

Let's look into the Ubuntu image on [Docker Hub](https://hub.docker.com/r/library/ubuntu/) and trace the process.

The description/readme says:

    What's in this image?

     This image is built from official rootfs tarballs provided by Canonical
     (see dist-* tags at https://git.launchpad.net/cloud-images/+oci/ubuntu-base).

We can see that the image is built from <https://git.launchpad.net/cloud-images/+oci/ubuntu-base>.

Let's take a closer look at Ubuntu to verify where it comes from. If you click the Dockerfile link of <https://hub.docker.com/r/_/ubuntu/> you'll be given a json file instead of the Dockerfile contents. The digest seems to contain the valid digest for a single architecture version listed on Docker Hub (amd64). But after downloading it and checking the digest `docker pull ubuntu:22.04 && docker images --digests` the result does not match up.

We find a Dockerfile from the repository [here](https://git.launchpad.net/cloud-images/+oci/ubuntu-base/tree/Dockerfile?h=jammy-22.04). We can increase trust that it's the same as the image we downloaded with `image history`:

```console
$ docker image history --no-trunc ubuntu:22.04
```

The output from image history matches with the directives specified in the Dockerfile. If this isn't enough, we could also build the image ourselves.

The first line states that the image starts FROM a **special** image "scratch" that is just empty. Then a file `ubuntu-*-oci-$LAUNCHPAD_BUILD_ARCH-root.tar.gz` is added to the root from the same [directory](https://git.launchpad.net/cloud-images/+oci/ubuntu-base/tree/?h=jammy-22.04).

Notice how the file is not extracted at any point. The `ADD` instruction [documentation](https://docs.docker.com/engine/reference/builder/#add) states that "If src is a local tar archive in a recognized compression format (identity, gzip, bzip2 or xz) then it is unpacked as a directory."

We could verify the checksums of the file if we were interested. For the Ubuntu image automation from the launchpad takes care of creating the PRs to docker-library and the maintainers of the official images repository verify the PRs.

You can also visit the Docker Hub page for the image tag itself, which shows the layers and warns about potential security issues. Note how many different problems it finds [here](https://hub.docker.com/layers/library/ubuntu/22.04/images/sha256-b2175cd4cfdd5cdb1740b0e6ec6bbb4ea4892801c0ad5101a81f694152b6c559?context=explore).

Now we have learned that the build processes are open and we can verify it if we have the need. In addition, we learned that there's nothing that makes the "official" images special.

#### "You can't trust code that you did not totally create yourself."
###### - Ken Thompson (1984, Reflections on Trusting Trust)
