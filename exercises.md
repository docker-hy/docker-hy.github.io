---
layout: page
title: exercises
inheader: yes
permalink: /exercises/
order: 1
---

# How to return exercises

Make a repository and publish your solutions there in clearly ordered files / folders.
How to submit your github repository is not yet implemented but will appear here.

Please note that at the moment of writing this (26.10) not all exercises have been made and if you wish to complete the course you may have to backtrack and complete exercises from material you've previously read.

Deadline will also be here.

## Part 1

**1.1.1**

Start 3 containers from image that does not automatically exit, such as nginx, detached.

Stop 2 of the containers leaving 1 up.

Prove that you have completed this part of exercise by delivering the output for docker ps -a.

**1.1.2**

Clean the docker daemon from all images and containers.

Prove that you have completed this part of exercise by delivering the output for docker ps -a and docker images

**1.2.1**

Start a ubuntu image with the process "sh -c 'read website; sleep 3; curl http://$website'"

Please note that curl is NOT installed in the container yet.

**For the exercises 1.3, 1.4, 1.5, return both Dockerfile(s) and the command you used to run the container(s)**

**1.3** This exercise is mandatory

Clone, fork or download a project from <https://github.com/docker-hy/frontend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 5000 exposed and published so when you start the container and navigate to <http://localhost:5000> you will see message if you're successful.

*Do not alter the code of the project*

> TIP: The project has install instructions in README.
> TIP: You do not have to install anything new outside containers.

**1.4** This exercise is mandatory

Clone, fork or download a project from <https://github.com/docker-hy/backend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 8000 exposed and published so when you start the container and navigate to <http://localhost:8000> you will generate a message in logs.txt in the root.

Save the logs.txt into a volume anywhere on host. So you can shut down the application you can see the same log message.

*Do not alter the code of the project*

**1.5** This exercise is mandatory 

Start both frontend-example and backend-example with correct ports exposed and configure the CMD with information from README.
You know that the configuration is ready when the "Send!" button of frontend-example responds.

*Do not alter the code of either project*

**1.6**

Create Dockerfile for an application in any of your own repositeries and publish it to Docker Hub. This can be any project except clones / forks of backend-example or frontend-example.

For this exercise to be complete you have to provide the link to the project in docker hub, make sure you have instructions in README.

**1.7**

Create an image that contains your favorite programming environment in it's entirety.

This means that a computer that only has docker can use the image to start a container which contains all the tools from IDE / Editor to a way to test code. The environment can be partially used by running commands manually inside the container.

Explain what you created and publish it to Docker Hub.
