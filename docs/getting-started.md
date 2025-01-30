---
sidebar_position: 2
---

# Getting Started

Welcome to the DevOps with Docker course! This course is designed to be completed sequentially, from start to finish. Each part builds on the previous one, so it's important to read the material carefully and complete the exercises to develop the necessary skills.

To pass the course, you will need to complete all of the exercises. However, one exercise can be skipped per part, except for the exercises marked as mandatory. The mandatory exercises cannot be skipped.

The exercises are designed to reinforce the material covered in each part and are placed at strategic points in the course to ensure that you have learned the necessary skills before attempting each exercise. You can complete the exercises at your own pace, and there is no deadline for submission outside of the last date when the entire course ends.

When submitting your exercises, please follow the instructions provided in the course material. Exercises should be submitted in a specific format, which will be outlined in the instructions for each exercise.

We hope that you enjoy the course and find it informative and engaging. Good luck!

### Prerequisites

The course is suitable for anyone interested in Docker or containerization and has at least some experience with the Linux command line. It also helps if you have some experience in web development.

### About different architectures and contributing

Please note that while Docker runs on all major operating systems and even on ARM architecture, this course material may not cover platform-specific details for all operating systems. However, we've had students successfully complete the course using a variety of machines and operating systems.

If you encounter any issues while working through the course material on your particular system, we recommend consulting the Docker documentation or seeking help on the course forums. Our community is here to support you and help you succeed in the course!

We welcome contributions to the course material from students and other members of the DevOps community! If you notice any mistakes, typos, or errors in the material, please consider submitting a pull request to the course repository on GitHub.

Thank you in advance for your contributions to this open-source project!

### Grading

Passing this course requires you to do the exercises for each part. This means generally every exercise, but you are allowed to skip one non-mandatory exercise in each part. Some of the exercises are mandatory and can not be skipped.

This course is worth 1-3 credits depending on the completed parts. Completing part 1 gives you 1 credit. Completing parts 1 and 2 is worth 2 credits. Completing all of the parts will grant you 3 credits.

There are additional instructions for completion after each part and at the end of this page.

### Learning objectives

Part 1: DevOps with Docker ([TKT21036](https://studies.helsinki.fi/kurssit/toteutus/otm-4bd45ab8-8b23-4973-a918-a6b6f7bbb347/TKT21036))

- Understand the fundamental concepts of Docker, including images and containers.
- Learn how to build Docker images for existing projects and run them.
- Understand how Docker can simplify the development process.

Part 2: DevOps with Docker: docker-compose ([TKT21037](https://studies.helsinki.fi/kurssit/toteutus/otm-c73ef1c6-8fb0-42e8-9052-ef59b01cb409/TKT21037))

- Learn how to manage complex multi-container applications with Docker Compose.
- Understand the role of Docker Compose in container orchestration
- Practice deploying and managing real-world applications using Docker Compose.

Part 3: DevOps with Docker: security and optimization ([TKT21038](https://studies.helsinki.fi/kurssit/opintojakso/hy-CU-142971306-2020-08-01/TKT21038))

- Learn how to optimize Docker images for production, including reducing image size and improving security.
- Understand the limitations of using Docker Compose in production environments and the need for more advanced orchestration tools.
- Explore alternative container orchestration solutions, including Kubernetes.

### Where to find information about the course?

All of the details you need to complete the course should be found on this page. If something is missing or unclear after reading this page, please contact matti.luukkainen@helsinki.fi or get in touch through Discord.

### Discord

This course has a Discord group where we discuss everything about the course. Support is available almost 24/7, with the discussion being in both English and Finnish.

Join our discord group [here](https://study.cs.helsinki.fi/discord/join/docker).

**All** inappropriate, degrading or discriminating comments on the channel are prohibited and will lead to action taken against the commenter.

# Warning: Before installing Docker

Containers leverage the power of your own operating system. As such **by default** any containerized application, or user who has external access to your container, would have super user privileges to your computer.

I will try my best to alert you of potential risks as we encounter them, but due to the structure of the course we will focus on security in part 3.

Please keep this in mind as you move through the installation and exercises. If you ever feel unsure about what you're doing, come to the Discord channel and have a chat with us.

## Installing Docker

Use the official documentation to find download instructions for docker-ce for the platform of your choice:

[Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

- If you have _fuksiläppäri_, that is, a freshman laptop of University of Helsinki, do the installation as described
[here](https://version.helsinki.fi/cubbli/cubbli-help/-/wikis/Docker)

[MacOS](https://docs.docker.com/docker-for-mac/install/)

[Windows](https://docs.docker.com/docker-for-windows/install/)



Confirm that Docker installed correctly by opening a terminal and running `docker -v` to see the installed version.

:::tip Docker group

To avoid writing sudos you may consider [adding yourself to docker group](https://docs.docker.com/install/linux/linux-postinstall/)

Keep in mind that if you do so, you can now run containers without sudo and containers give you or anyone who gains access to your account super user access to the computer.

:::

### Rootless Docker

Instead of above installation, on Linux you can run Docker as a non-root user. This requires that your system has [certain programs and configurations set up in advance](https://docs.docker.com/engine/security/rootless/#prerequisites) by the system administrator. Since running Docker in rootless mode limits risks for system security, convincing your IT admin to cooperate to the extent required for rootless Docker may be viable alternative if you do not have administrative privileges yourself.

If your system is set up correctly, you can possibly run locally available installation script dockerd-rootless-setuptool.sh or download it from [https://get.docker.com/rootless](https://get.docker.com/rootless). The script will inform you of any missing requirements, if there are any. The script will also tell you how to control docker service, and what settings to set or change in your environment (PATH, DOCKER_HOST).

See also [known limitations](https://docs.docker.com/engine/security/rootless/#known-limitations).

Do note that while running Docker rootless does limit some security risks to your system, it just adds one hurdle for potential malicious attacker (and in any case, system staying secure might not sound so great if you end up "only" losing your user data).

### Podman

Alternatively, your system may already have [Podman](https://podman.io/) installed (or you can [install it yourself](https://podman.io/docs/installation)). Podman is another containerization framework, functioning as a drop-in replacement for Docker to a high degree - often you can just replace command docker with command podman. If you intend to work later with Kubernetes, Podman also offers some extra conveniences, but on the other hand Podman does not support Docker Swarm.

This course should be doable with `alias docker=podman`. Easiest way to make this permanent is `echo "alias docker=podman" >> .bashrc`. Podman does not use default registry, while Docker uses docker.io by default. You will need to remember define registry with your commands (eg, `docker run docker.io/nginx`) or you need to configure your default registry (`mkdir $HOME/.config/containers && echo "unqualified-search-registries = ['docker.io']" >> $HOME/.config/containers/registries.conf`)

If `podman info | grep graphDriverName` tells you are using vfs as your storage driver, prepare for _very_ slow and large builds. Requesting (or installing yourself) and then using fuse-overlayfs or native overlay (in recent Ubuntu and Debian package containers-storage) would be a good idea. (Or possibly changing default configuration with $HOME/.config/containers/storage.conf might be enough. [source](https://blog.abysm.org/2023/06/switching-system-wide-default-storage-driver-from-vfs-to-overlayfs-for-podman-on-debian-bookworm/))

Some of the Podman output may slightly differ from example Docker output in the material.

## Deadline

The sign up for ECTS credits and the course ends 16.6.2024! After that course is locked and submissions can no longer be made or credits earned. As the certificate is received through submissions, you have to submit everything before the course ends. More details under completion and after each part.

## General guidance

_Do not alter the code of the projects, unless by pull-requests to the original projects_

You do not need to touch Ruby, Java, Javascript or Python code during this course. You may have to read their error messages.

Visit the Discord channel if you are stuck!

## How to submit the exercises

Make a repository to GitHub and publish your solutions in clearly ordered files / folders. If you need help publishing using Git you should refer to their [guide](https://guides.github.com/activities/hello-world/). Make sure that the repository is available to us, either by using a public repository or a private repository and adding Jakousa and mluukkai as collaborators.

Most of the exercises will be focused on a Dockerfile and/or docker-compose.yml. In those cases, submitting the file is enough. In other cases, a picture or copy-paste from your command line or a link to Docker Hub and/or project inside the repository is enough. For the command line exercises at start the command [script](https://linux.die.net/man/1/script) may be helpful.

Because the course exercises are designed to build upon each other, it's more important that you document the exercises for yourself. We will be looking at the submissions of the later exercises as they are more demanding.

When you have completed a part, use the [submission application](https://studies.cs.helsinki.fi/stats/courses/docker2024) to mark your exercises. You can **not** edit a submission, so make sure you have completed enough exercises for a part before submitting.

## Completing

The certificate is available from the small icon beneath your submissions!

After you have returned all of the required exercises and wish to end your course completion and want the ECTS credits press the following button in the submission application (ignore the message about an "exam" as there is no exam in this course):

![Incomplete course](/img/incomplete_course.png)

After that, double-check that the application has the message "Course marked as completed" and the date. If the date is not visible, we have not been notified.

![Completed course](/img/completed_course.png)
