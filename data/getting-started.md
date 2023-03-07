---
path: "/getting-started"
title: "Getting started"
hidden: false
information_page: true
sidebar_priority: 4000
---

The course material is meant to be read sequentially, part by part, from start to finish. To get a passing grade you have to complete each exercise. Except one exercise can be skipped for each part. Some of the exercises are marked as mandatory and the mandatory exercises can not be skipped. The exercises are placed in the material in such a way that you will have learned the necessary skills from the material prior to each given exercise. You can do the exercises as you're going through the material.

The course material does not consider all operating systems and as such some instructions may lack platform-specific details. But we've had students who've made it through the material with varying machines. Please make a [pull request](https://github.com/docker-hy/docker-hy.github.io#user-content-contributing-to-the-content) to the course material if you find any mistakes or wish to add something. You can also [contribute](https://github.com/docker-hy/docker-hy.github.io#user-content-contributing-to-the-content) through GitHub.

### Completing course

The course is composed of 3 parts. You should read through this page before starting with part 1. This part includes installation instructions and a serious warning. The parts should take 5-25 hours each to complete.

Here are additional instructions for completion after each part and at the end of this page.

### Grading

Passing this course requires you to do the exercises for each part. This means generally every exercise, but you are allowed to skip one non-mandatory exercise in each part. Some of the exercises are mandatory and can not be skipped. This course is worth 1-3 credits depending on the completed parts.
Completing part 1 gives you 1 credit. Completing parts 1 and 2 is worth 2 credits. Completing all of the parts will grant you 3 credits.

### Learning objectives

Part 1

Can explain what images and containers are and how they're related.
Can build images with Docker for existing projects and run them.

Part 2

Can manage complex multi-container applications with docker-compose.

Part 3

Can optimize images sizes and security for production.
Knows why docker-compose is not an optimal production solution and what is.

### Course has multiple pages

The DevOps with Docker course is split into 3 parts:

- DevOps with Docker ([TKT21036](https://studies.helsinki.fi/opintotarjonta/cur/otm-a1a074e0-dc7f-4644-8796-04fab528ba36/TKT21036/DevOps_with_Docker))
- DevOps with Docker: docker-compose ([TKT21037](https://studies.helsinki.fi/opintotarjonta/cur/otm-d37daa67-f5b1-4bdb-88a5-98107d2c63ea/TKT21037/DevOps_with_Docker_docker_compose))
- DevOps with Docker: security and optimization ([TKT21038](https://studies.helsinki.fi/opintotarjonta/cur/otm-68b6e802-0b55-438c-85aa-1fd9d0ad80be/TKT21038/DevOps_with_Docker_security_and_optimization))

You can click the links to visit each of the subcourse pages. However, all the details should be found on this page. If something is missing or unclear after reading this page, please contact matti.luukkainen@helsinki.fi or get in touch through Discord.

### Discord

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our discord group [here](https://study.cs.helsinki.fi/discord/join/docker).

**All** inappropriate, degrading or discriminating comments on the channel are prohibited and will lead to action taken against the commenter.

# Warning: Before installing Docker

Containers leverage the power of your own operating system. As such **by default** any containerized application, or user who has external access to your container, would have super user privileges to your computer.

I will try my best to alert you of potential risks as we encounter them, but due to the structure of the course we will focus on security in part 3.

Please keep this in mind as you move through the installation and exercises. If you ever feel unsure about what you're doing, come to the channel and have a chat with us.

## Installing Docker

Use the official documentation to find download instructions for docker-ce for the platform of your choice:

[Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

[MacOS](https://docs.docker.com/docker-for-mac/install/)

[Windows](https://docs.docker.com/docker-for-windows/install/)

Confirm that Docker installed correctly by opening a terminal and running `docker -v` to see the installed version.

<text-box name="Docker Group" variant="hint">

To avoid writing sudos you may consider [adding yourself to docker group](https://docs.docker.com/install/linux/linux-postinstall/)

Keep in mind that if you do so, you can now run containers without sudo and containers give you super user access to the computer.

</text-box>

## Deadline

The sign up for ECTS credits and the course ends 18.6.2023! After that course is locked and submissions can no longer be made or credits earned. As the certificate is received through submissions, you have to submit everything before the course ends. More details under completion and after each part.

## General guidance

_Do not alter the code of the projects, unless by pull-requests to the original projects_

You do not need to touch ruby, java, js or python code during this course. You may have to read their error messages.

Visit the Discord channel if you are stuck!

## How to return exercises

Make a repository to GitHub and publish your solutions in clearly ordered files / folders. If you need help publishing using Git you should refer to their [guide](https://guides.github.com/activities/hello-world/). Make sure that the repository is available to me, either by using a public repository or a private repository and adding Jakousa as a collaborator.

Most of the exercises will be focused on a Dockerfile and/or docker-compose.yml. In those cases, submitting the file is enough. In other cases, a picture or copy-paste from your command line or a link to Docker Hub and/or project inside the repository is enough. For the command line exercises at start the command `script` ([https://linux.die.net/man/1/script](https://linux.die.net/man/1/script)) may be helpful.

When you have completed a part, use the [submission application](https://studies.cs.helsinki.fi/stats/courses/docker2023) to mark your exercises. You can **not** edit a submission, so make sure you have completed enough exercises for a part before submitting.

## Completing

The certificate is available from the small icon beneath your submissions!

After you have returned all of the required exercises and wish to end your course completion and want the ECTS credits press the following button in the submission application (ignore the message about an "exam" as there is no exam in this course):

<img src="./img/incomplete_course.png">

After that, ensure that the application has the message "Course marked as completed" and the date.

<img src="./img/completed_course.png">