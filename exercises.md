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
If you need help publishing using git you should refer to their [guide](https://guides.github.com/activities/hello-world/).

When you have completed a part, use the [submission application](https://studies.cs.helsinki.fi/courses/#/docker-beta) to mark your exercises.

Beta deadlines, please note that these are not "hard deadlines" as there might be major changes:
 
Deadline for parts 1 and 2 is 15.12. Please note that the numbering has changed for part 1 when submitting exercises.

Deadline for part 3 is 22.12, but this text should be removed by 18.12

## Part 1

**1.1**

Practice the commands.

Start 3 containers from image that does not automatically exit, such as nginx, detached.

Stop 2 of the containers leaving 1 up.

Prove that you have completed this part of exercise by delivering the output for docker ps -a.

**1.2**

We've left containers and a image that won't be used anymore and are taking space, as `docker ps -a` and `docker images` will reveal.
Clean the docker daemon from all images and containers.

Prove that you have completed this part of exercise by delivering the output for `docker ps -a` and `docker images`

**1.3**

Run a process with dependencies.

Start a ubuntu image with the process `sh -c "read website; sleep 3; curl http://$website:"`

Test inputting helsinki.fi into the application. It should respond with something like

```
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="http://www.helsinki.fi/">here</a>.</p>
</body></html>
```

> Please note that curl is NOT installed in the container yet. You will have to install it from inside of the container.

**For the following exercises, return both Dockerfile(s) and the command you used to run the container(s)**

**1.4**

Last exercise solution was not practical. Now that we know how to create and build Dockerfiles we can fix that.
Write Dockerfile for 1.3. Build the image with tag "curler".

Run command `docker run curler` and input helsinki.fi into it. Output should match the 1.3 one.

**1.5** This exercise is mandatory

A good developer creates well written READMEs that can be used to create Dockerfiles with ease.

Clone, fork or download a project from <https://github.com/docker-hy/frontend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 5000 exposed and published so when you start the container and navigate to <http://localhost:5000> you will see message if you're successful.

*Do not alter the code of the project*

> TIP: The project has install instructions in README.
> TIP: You do not have to install anything new outside containers.

**1.6** This exercise is mandatory

Clone, fork or download a project from <https://github.com/docker-hy/backend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 8000 exposed and published so when you start the container and navigate to <http://localhost:8000> you will generate a message in logs.txt in the root.

Create a volume for the logs.txt so that when the application is shut down the logs are not destroyed. And when restarted it continues to write into the same logs.txt.

*Do not alter the code of the project*

**1.7** This exercise is mandatory 

Start both frontend-example and backend-example with correct ports exposed and configure the CMD with necessary information from README. 
You know that the configuration is ready when the button for 1.7 of frontend-example responds.

*Do not alter the code of either project*

![]({{ "/images/exercises/back-and-front.png" | absolute_url }})

> TIP: When configuring web applications keep browser developer console ALWAYS open, F12 or cmd+shift+I when the browser window is open. Information about configuring cross origin requests is in README of the backend project. 

> TIP: Developer console has multiple views, most important ones are Console and Network. Exploring the Network tab can give you a lot of information on where messages are being sent and what is received as response!

**1.8**

Create Dockerfile for an application in any of your own repositories and publish it to Docker Hub. This can be any project except clones / forks of backend-example or frontend-example.

For this exercise to be complete you have to provide the link to the project in docker hub, make sure you have instructions in README.

**1.9**

Create an image that contains your favorite programming environment in it's entirety.

This means that a computer that only has docker can use the image to start a container which contains all the tools and libraries. Excluding IDE / Editor. The environment can be partially used by running commands manually inside the container.

Explain what you created and publish it to Docker Hub.


## Part 2

*Do not alter the code of the projects*
*Exercises in part 2 should be done using docker-compose*

**2.1** This exercise is mandatory

As we saw previously, starting an application with two programs was not trivial and the commands got a bit long.

Since we already created working Dockerfiles for both frontend and backend we can go step further and simplify the usage into one docker-compose.yml.

Configure the backend and frontend from part 1 to work in docker-compose.

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

# Part 3

**3.1**

Return back to our frontend & backend Dockerfiles and you should see the some mistakes we now know to fix.

Document both image sizes at this point, as was done in the material. Optimize the Dockerfiles of both programs, frontend and backend.

After your improvements document the image sizes again.

**3.2**

We've used the youtube-dl a lot in the material but I believe that we should expand our horizons.

Create a new Dockerfile for [yle-dl](https://aajanki.github.io/yle-dl/) and optimize it. 

Use your application to download something without breaking the [YLE Terms of Service](https://ohjeet.areena.yle.fi/hc/fi/articles/115002969969-Yle-Areenan-k%C3%A4ytt%C3%B6ehdot)

Exercise 3.2 was created by [Terho Uotila](https://github.com/qzuw)

**3.3** This exercise is mandatory

Return back to our frontend & backend Dockerfiles and you should see the some mistakes we now know to fix.

Security issues with the user being a root are serious as the containers for web services are supposed to be accessible through the internet.

**3.4**

Document the image size before the changes.

Rather than going alpine, go look into [docker-node](https://github.com/nodejs/docker-node) we realize there's more possibilities to improve to do in frontend & backend. Theres even a [best practices guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)

Return back to our frontend & backend Dockerfiles and you should see the some mistakes we now know to fix.

Document the size after this change.

**3.5**

Do all of the optimizations from security to size for any other Dockerfile you have access to, for example the ones used in exercises 1.8, 1.9, 2.4 or 3.2. Please document both before and after.

**3.6**

**3.7**

