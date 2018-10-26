---
layout: page
title: part 0
inheader: yes
permalink: /part0/
---

## General  

This course is an introductory course to Docker and docker-compose. Course will also look into what different parts web services consist of such as reverse proxies, databases etc. Docker can not be installed on faculty computers so students will need to provide their own computers to follow the examples outlined in this course material and to complete the exercises. 

### Prerequisites  

Attendees need to provide their own computers with admin/superuser priviledges. Attendees are also expected to have a general understanding of software development and experience with a CLI of their choice. 

### Course material 

Course material is meant to be read part by part from start to finish. To get a passing grade you have to do every exercise, except you can skip one exercise for each part. Some of the exercises are marked as mandatory and they can not be skipped. There are exercises in the material placed so that you will have learned needed skills in the material before it. You can do the exercises as you go through the material.

Course material is written for Ubuntu, some instructions might be missing platform specific details. Please make a pull request to course material in case you find any mistakes or wish to add something. You can also add an "issue" through github in case you find any issues with the course material. 

### Completing course 

Course is composed of 4 parts, first of which is 0 and contains the pre-requisites for doing any of the exercises. The parts should take 5-25 hours each.  

### Grading 

Passing this course requires you to do the required exercises for each credit. This course is worth 1-3 credits depending on the completed parts.
Completing part 1 gives you 1 credit. Completing parts 1 and 2 is worth 2 credits. And completing all of the parts will grant you 3 credits.

## Getting started

#### Starting lecture

Starting lecture is not mandatory. It will be held ??:?? ??.12.2018 in ???? Exactum

Slides for starting lecture can be found [here]()

#### Telegram

Join our telegram [here](). Where we discuss everything about the course and support is available almost 24/7. Discussion is in both english and finnish.

**All** inappropriate, degrading or discriminating comments on the channel are prohibited and will lead to action taken against the commenter.

## Installing Docker 

Use the official documentation to find download instructions of docker-ce for the platform of your choice: 

[Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[MacOS](https://docs.docker.com/docker-for-mac/install/)

[Windows](https://docs.docker.com/docker-for-windows/install/)

Confirm we have docker installed correctly:

Open terminal and run `docker -v` to see your installed docker version. 

## Installing docker-compose 

During the writing of this, both MacOS and Windows have docker-compose included in their respective docker packages. 

Use the official documentation to find download instructions of docker-compose for the platform of your choice: 

[Install instructions](https://docs.docker.com/compose/install/)

Confirm we have docker-compose installed:

Open terminal and run `docker-compose -v` to see your installed docker-compose version. 

> TIP: To avoid writing sudos you may consider [adding yourself to docker group](https://docs.docker.com/install/linux/linux-postinstall/)

### Mistakes:

If you find anything missing, issues, typos or mistakes with the material. You can add an [issue](https://github.com/Jakousa/jakousa.github.io/issues) and if you want to commit to the project you can do so by creating a [pull request](https://github.com/Jakousa/jakousa.github.io/pulls) with your proposed fixes.
