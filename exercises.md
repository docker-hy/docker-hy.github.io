---
layout: page
title: exercises
inheader: yes
permalink: /exercises/
order: 1
---

# Passing

To get a passing grade you have to do every exercise, except you can skip one exercise for each part. You can not "save" skips between parts. Some of the exercises are marked as mandatory and they can not be skipped. 

# How to return exercises

Make a repository and publish your solutions there in clearly ordered files / folders.

When you have completed a part, use the [submission application](https://studies.cs.helsinki.fi/courses/#/docker-beta) to mark your exercises.

Please note that at the moment of writing this (26.10) not all exercises have been made and if you wish to complete the course you may have to backtrack and complete exercises from material you've previously read.

Beta deadlines, please not that these are not "hard deadlines" as there might be major changes:

Deadline for part 1 is 26.11. 
Deadline for part 2 is 10.12. 
Deadline for part 3 is 22.12.

## Part 1

**1.1**

Start 3 containers from image that does not automatically exit, such as nginx, detached.

Stop 2 of the containers leaving 1 up.

Prove that you have completed this part of exercise by delivering the output for docker ps -a.

**1.2**

Clean the docker daemon from all images and containers.

Prove that you have completed this part of exercise by delivering the output for docker ps -a and docker images

**1.3**

Start a ubuntu image with the process "sh -c 'read website; sleep 3; curl http://$website'"

Please note that curl is NOT installed in the container yet. You will have to install it from inside of the container.

**For the exercises 1.4, 1.5, 1.6, commit both Dockerfile(s) and the command you used to run the container(s)**

**1.4** This exercise is mandatory

Clone, fork or download a project from <https://github.com/docker-hy/frontend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 5000 exposed and published so when you start the container and navigate to <http://localhost:5000> you will see message if you're successful.

*Do not alter the code of the project*

> TIP: The project has install instructions in README.
> TIP: You do not have to install anything new outside containers.

**1.5** This exercise is mandatory

Clone, fork or download a project from <https://github.com/docker-hy/backend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 8000 exposed and published so when you start the container and navigate to <http://localhost:8000> you will generate a message in logs.txt in the root.

Save the logs.txt into a volume anywhere on host. So you can shut down the application you can see the same log message.

*Do not alter the code of the project*

**1.6** This exercise is mandatory 

Start both frontend-example and backend-example with correct ports exposed and configure the CMD with information from README.
You know that the configuration is ready when the button for 1.6 of frontend-example responds.

*Do not alter the code of either project*

> TIP: When configuring web applications keep browser developer console ALWAYS open, F12 or cmd+shift+I when the browser window is open. Information about configuring cross origin requests is in README of the backend project. 

> TIP: Developer console has multiple views, most important ones are Console and Network. Exploring the Network tab can give you a lot of information on where messages are being sent and what is received as response!

![]({{ "/images/exercises/back-and-front.png" | absolute_url }})

**1.7**

Create Dockerfile for an application in any of your own repositories and publish it to Docker Hub. This can be any project except clones / forks of backend-example or frontend-example.

For this exercise to be complete you have to provide the link to the project in docker hub, make sure you have instructions in README.

**1.8**

Create an image that contains your favorite programming environment in it's entirety.

This means that a computer that only has docker can use the image to start a container which contains all the tools and libraries. Excluding IDE / Editor. The environment can be partially used by running commands manually inside the container.

Explain what you created and publish it to Docker Hub.


## Part 2

*Do not alter the code of the projects*
*Exercises in part 2 should be done using docker-compose*

**2.1**

Configure 1.4 and 1.5 to work in docker-compose.

Since we already created working Dockerfiles for both frontend and backend we can go step further and simplify the usage into one docker-compose.yml.

**2.2**

Add redis to example backend. 

Redis is used to speed up some operations. Backend uses a slow api to get information. You can test the slow api by connecting to /slow. It should take 10 to 20 seconds to get a response.

Configure a redis container to cache information for the backend. Use the documentation if needed when configuring: <https://hub.docker.com/_/redis/>

![]({{ "/images/exercises/back-front-and-redis.png" | absolute_url }})

**2.3**

Add database to example backend.

Lets use a postgres database to save messages. We won't need to configure a volume since the official postgres image sets a default volume for us. Lets use the postgres image documentation to our advantage when configuring: <https://hub.docker.com/_/postgres/>. Especially part Environment Variables is of interest.

The backend README should have all the information needed to connect.

> TIP: When configuring the database, you might need to destroy the automatically created volumes. Use command `docker volume prune` to remove unused volumes when testing.

![]({{ "/images/exercises/back-front-redis-and-database.png" | absolute_url }})


**2.4**

Configure a machine learning project.

Look into machine learning project created with Python and React and split into three parts: [frontend](https://github.com/docker-hy/ml-kurkkumopo-frontend), [backend](https://github.com/docker-hy/ml-kurkkumopo-backend) and [training](https://github.com/docker-hy/ml-kurkkumopo-training) 

Note that the training requires 3 volumes and backend should share volume /src/models with training. 

The frontend will display on http://localhost:3000 and the application will tell if the subject of an image looks more like a cucumber or a moped.

Exercise 2.4 was created by [Sasu Mäkinen](https://github.com/sasumaki)

**2.5**

Add nginx to example frontend + backend

![]({{ "/images/exercises/back-front-redis-database-and-nginx.png" | absolute_url }})


Accessing your service from arbitrary port is counter intuitive since browsers use 80 (http) and 443 (https) by default. And having the service refer to two origins in a case where there's only one backend isn't desirable either. We will skip the SSL setup for https/443. 

The following file should be set to nginx containers /etc/nginx/nginx.conf.

```
events { worker_connections 1024; }

http {
  server {
    listen 80;
    server_name <imaginative-name>;

    location / {
      proxy_pass <frontend-connection>;
    }

    location /api/ {
      proxy_pass <backend-connection>;
    }
  }
}
```

**2.6**

Postgres image uses volume by default. Manually define volumes for redis and database in convenient locations. Use both image documentations to help you with the task.
