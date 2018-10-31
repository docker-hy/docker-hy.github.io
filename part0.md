---
layout: page
title: part 0
inheader: yes
permalink: /part0/
order: 0
---

## General

This course is an introductory course to Docker and docker-compose. The course will also look into what different parts web services consist of, such as reverse proxies, databases etc. Docker can not be installed on faculty computers so students will need to provide their own computers to follow the examples outlined in this course material and to complete the exercises.

### Prerequisites

Attendees need to provide their own computers with admin/superuser priviledges. Attendees are also expected to have a general understanding of software development and experience with a CLI of their choice.

### Course material

The course material is meant to be read part by part from start to finish. To get a passing grade you have to do every exercise, except you can skip one exercise for each part. Some of the exercises are marked as mandatory and they can not be skipped. There are exercises in the material placed so that you will have learned needed skills in the material before it. You can do the exercises as you go through the material.

The course material is written for Ubuntu, so some instructions may lack platform specific details. Please make a pull request to the course material in case you find any mistakes or wish to add something. You can also add an "issue" through github in case you find any issues with the course material.

### Completing course

The course is composed of 4 parts, first of which is 0 and contains the pre-requisites for doing any of the exercises. The parts should take 5-25 hours each.

### Grading

Passing this course requires you to do the required exercises for each credit. This course is worth 1-3 credits depending on the completed parts.
Completing part 1 gives you 1 credit. Completing parts 1 and 2 is worth 2 credits. Completing all of the parts will grant you 3 credits.

## Getting started

#### Starting lecture

Starting lecture is not mandatory. It will be held ??:?? ??.12.2018 in ???? Exactum

Slides for the starting lecture can be found [here](https://docs.google.com/presentation/d/1op-PxjIoCZ1k-o1JO1h9UhqZFYVMTcYHAQD-XrzwoIo/edit?usp=sharing)

#### Telegram

This course has a Telegram group where we discuss everything about the course. Support is available almost 24/7, with discussion being in both English and Finnish.

Join our telegram group [here](https://t.me/joinchat/HIg2vhI6xgyrWhVvJ7eiiA).

**All** inappropriate, degrading or discriminating comments on the channel are prohibited and will lead to action taken against the commenter.

## Installing Docker

Use the official documentation to find download instructions for docker-ce for the platform of your choice:

[Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[MacOS](https://docs.docker.com/docker-for-mac/install/)

[Windows](https://docs.docker.com/docker-for-windows/install/)

Confirm that Docker installed correctly by opening a terminal and running `docker -v` to see the installed version.

## Installing docker-compose

During the writing of these materials, both MacOS and Windows have docker-compose included in their respective Docker packages.

Use the official documentation to find download instructions for docker-compose for the platform of your choice:

[Install instructions](https://docs.docker.com/compose/install/)

Confirm that docker-compose installed correctly by opening a terminal and running `docker-compose -v` to see the installed docker-compose version.

> TIP: To avoid writing sudos you may consider [adding yourself to docker group](https://docs.docker.com/install/linux/linux-postinstall/)

### Mistakes:

If you find anything missing, issues, typos or mistakes with the material. You can add an [issue](https://github.com/docker-hy/docker-hy.github.io/issues) and if you want to commit to the project you can do so by creating a [pull request](https://github.com/docker-hy/docker-hy.github.io/pulls) with your proposed fixes.
