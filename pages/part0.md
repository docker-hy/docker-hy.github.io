---
layout: page
title: Part 0
inheader: yes
permalink: /part0/
order: 0
---

## General ##

This course is an introductory course to Docker and docker-compose. The course will also look into what different parts web services consist of, such as reverse proxies, databases, etc. Docker can not be installed on faculty computers, so students will need to use their computers to follow the examples outlined in this course material and to complete the exercises.

### Prerequisites ###

Attendees need to have computers with admin/superuser privileges. Attendees are also expected to have a general understanding of software development and experience with a CLI of their choice.

### Course material ###

The course material is meant to be read sequentially, part by part, from start to finish. To get a passing grade you have to complete each exercise. Except one exercise can be skipped for each part. Some of the exercises are marked as mandatory and the mandatory exercises can not be skipped. The exercises are placed in the material in such a way that you will have learned the necessary skills from the material prior to each given exercise. You can do the exercises as you're going through the material.

The course material does not consider all operating systems and as such some instructions may lack platform-specific details. But we've had students who've made it through the material with varying machines. Please make a [pull request](/contributing) to the course material if you find any mistakes or wish to add something. You can also [contribute](/contributing) through GitHub.

### Completing course ###

The course is composed of 4 parts, first of which is part 0 and contains the pre-requisites for all the upcoming exercises. The parts should take 5-25 hours each to complete.

Here are additional instructions for completion are after each part and on the [exercises page](/exercises)

### Grading ##

Passing this course requires you to do the exercises for each part. This means every exercise, except one for each part. Some of the exercises are mandatory and can not be skipped. This course is worth 1-3 credits depending on the completed parts.
Completing part 1 gives you 1 credit. Completing parts 1 and 2 is worth 2 credits. Completing all of the parts will grant you 3 credits.

### Learning objectives ###

Part 1

Can explain what images and containers are and how they're related.
Can build images with Docker for existing projects and run them.

Part 2

Can manage complex multi-container applications with docker-compose.

Part 3

Can optimize images sizes and security for production.
Knows why docker-compose is not an optimal production solution and what is.

## Getting started ##

### Course has multiple pages ###

As we're trying to make the course as accessible as possible, the course has multiple pages: [Studies page](https://studies.helsinki.fi/courses/cur/hy-CUR-135622221/Open_uni_DevOps_with_Docker_2021), [Mooc](https://mooc.fi/) and a GitHub page. Everything should be found from this page. If something is missing or unclear after reading this page, please contact jami.kousa@helsinki.fi or get in touch through Telegram.

### Telegram ###

This course has a Telegram group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our telegram group [here](https://t.me/joinchat/HIg2vkuQ1T4QUPJDxIgshQ).

**All** inappropriate, degrading or discriminating comments on the channel are prohibited and will lead to action taken against the commenter.

## Installing Docker ##

Use the official documentation to find download instructions for docker-ce for the platform of your choice:

[Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[MacOS](https://docs.docker.com/docker-for-mac/install/)

[Windows](https://docs.docker.com/docker-for-windows/install/)

Confirm that Docker installed correctly by opening a terminal and running ```docker -v``` to see the installed version.

## Installing docker-compose ##

During the writing of these materials, both macOS and Windows have docker-compose included in their respective Docker packages.

Use the official documentation to find download instructions for docker-compose for the platform of your choice:

[Install instructions](https://docs.docker.com/compose/install/)

Confirm that docker-compose installed correctly by opening a terminal and running ```docker-compose -v``` to see the installed docker-compose version.

> TIP: To avoid writing sudos you may consider [adding yourself to docker group](https://docs.docker.com/install/linux/linux-postinstall/)

### Before part 1 ###

Read the exercise guide over **[here](/exercises)**

### Mistakes: ###

Please read about [contributing](https://docker-hy.github.io/contributing)
