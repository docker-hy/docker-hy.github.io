
# In depth dive to images #

Images are the basic building blocks for containers and other images. When you "containerize" an application you work towards creating the image.

By learning what images are and how to create them you are ready to start utilizing containers in your own projects.

## Where do the images come from? ##

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

## A detailed look into an image ##

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

To summarize, an image name may consist of 3 parts plus a tag. Usually like the following: `registry/organisation/image:tag`. But may be as short as `ubuntu`, then the registry will default to docker hub, organisation to *library* and tag to *latest*. The organisation may also be an user, but calling it an organisation may be more clear.

{% include_relative exercises/1_5.html %}

{% include_relative exercises/1_6.html %}
