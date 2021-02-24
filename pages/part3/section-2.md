# Deployment pipeline with docker-compose #

Let's set up a deployment pipeline from GitHub to a host machine. We will demonstrate this using your local machine, but the same steps can be used for Raspberry Pi or even a virtual machine in the cloud (such as one provided by [Hetzner](https://www.hetzner.com/cloud)).

TODO Github Actions

We will CircleCI to build an image, push the image to Docker Hub, and then automatically pull the image from there.

Let's work with the repository [https://github.com/docker-hy/docker-hy.github.io](https://github.com/docker-hy/docker-hy.github.io) as it already has a Dockerfile and the CircleCI config for our convenience.

You can either fork the repository or clone it as your own.

Go to the [CircleCI homepage](https://circleci.com/) and sign in with your GitHub account. Give access and set up a new project.

CircleCI may give a guide on how to setup the project specific build. We can ignore it. Press Start Building in the CircleCI. After a while it should have a red "Failed" for the workflow.

We're using a docker *orb* in the [config.yml](https://github.com/docker-hy/docker-hy.github.io/blob/master/.circleci/config.yml) which requires environment variables to be set up in CircleCI [docker orb docs](https://circleci.com/orbs/registry/orb/circleci/docker).

Go to CircleCI Project Settings and Environment Variables to add them `DOCKER_PASSWORD` and `DOCKER_LOGIN`.

In addition you may be trying to publish to jakousa/docker-hy instead of to your own. Change the config.yml, I recommend using `$DOCKER_LOGIN/$CIRCLE_PROJECT_REPONAME` as this will 90% of the time automagically fill them as you wanted - from the login environment variable and from the repository name.

Then rerun the workflow in CircleCI and it should succeed. 

Now create a docker-compose.yml. We will use [watchtower](https://github.com/containrrr/watchtower) to automate the updates.

```yaml
version: "3"
services:
  coursematerial:
    image: jakousa/docker-hy
    ports:
      - 4000:80
    container_name: coursematerial
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    container_name: watchtower
```

Before running docker-compose up here, beware that watchtower will try to update **every** image running. Check the [documentation](https://containrrr.github.io/watchtower/) if you want to prevent this.

Run this with `docker-compose up` and commit something new into the repository. You can now follow from `git push` to Circle CI to DockerHub to wherever you ran docker-compose up. By default watchtower will poll Docker Hub every 5 minutes so it may take a while.

{% include_relative exercises/3_2.html %}

{% include_relative exercises/3_3.html %}