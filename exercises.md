---
layout: page
title: exercises
inheader: yes
permalink: /exercises/
order: 1
---

[Part 1](#part-1) [Part 2](#part-2) [Part 3](#part-3)

## Passing ##

To get a passing grade you have to do every exercise, except you can skip one exercise for each part. You can not "save" skips between parts. Some of the exercises are marked as mandatory and they can not be skipped. 

## Deadline ##

## How to return exercises ##

Make a repository and publish your solutions there in clearly ordered files / folders.
If you need help publishing using git you should refer to their [guide](https://guides.github.com/activities/hello-world/).

When you have completed a part, use the [submission application](https://studies.cs.helsinki.fi/courses/#/) to mark your exercises. Please choose the correct course.

## Part 1 ##

### 1.1 ###

Practice the commands.

Start 3 containers from image that does not automatically exit, such as nginx, detached.

Stop 2 of the containers leaving 1 up.

Prove that you have completed this part of exercise by delivering the output for docker ps -a.

### 1.2 ### 

We've left containers and a image that won't be used anymore and are taking space, as `docker ps -a` and `docker images` will reveal.
Clean the docker daemon from all images and containers.

Prove that you have completed this part of exercise by delivering the output for `docker ps -a` and `docker images`

### 1.3 ###

Start image `devopsdockeruh/pull_exercise` with flags `-it` like so: `docker run -it devopsdockeruh/pull_exercise`. It will wait for your input. Navigate through docker hub to find the docs and Dockerfile that was used to create the image.

Read the Dockerfile and/or docs to learn what input will get the application to answer a "secret message".

Submit the message and commands given as your answer.

### 1.4 ###

Now that we've warmed up it's time to get inside a container while it's running!

Start image `devopsdockeruh/exec_bash_exercise`, it will start a container with clock-like features and create a log. Go inside the container and use `tail -f ./log.txt` to follow the logs. Every 15 seconds the clock will send you a "secret message".

Submit the message and commands given as your answer.

### 1.5 ### 

Start a ubuntu image with the process `sh -c 'echo "Input website:"; read website; echo "Searching.."; sleep 1; curl http://$website;'`

You will notice that a few things required for proper execution are missing. Be sure to remind yourself which flags to use so that the read actually waits for input.

> Note also that curl is NOT installed in the container yet. You will have to install it from inside of the container.

Test inputting `helsinki.fi` into the application. It should respond with something like

```
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="http://www.helsinki.fi/">here</a>.</p>
</body></html>
```

This time return the command you used to start and the commands you used to fix the ensuing problems.

> This exercise has multiple solutions, if the curl for helsinki.fi works then it's done. Can you figure out other (smart) solutions?

**For the following exercises, return both Dockerfile(s) and the command you used to run the container(s)**

### 1.6 ###

Create a Dockerfile that starts with `FROM devopsdockeruh/overwrite_cmd_exercise` and works only as a clock.

The developer has poorly documented how the application works. Passing flags will open different functionalities, but we'd like to create a simplified version of it.

Add a CMD line to the Dockerfile and tag it as "docker-clock" so that `docker run docker-clock` starts the application and the clock output.

### 1.7 ### 

Now that we know how to create and build Dockerfiles we can improve previous works.

Make a script file for `echo "Input website:"; read website; echo "Searching.."; sleep 1; curl http://$website;` and run it inside the container using CMD. Build the image with tag "curler".

Run command `docker run [options] curler` (with correct flags again, as in 1.3) and input helsinki.fi into it. Output should match the 1.3 one.

### 1.8 ###

In this exercise we won't create a new Dockerfile. 
Image `devopsdockeruh/first_volume_exercise` has instructions to create a log into `/usr/app/logs.txt`. Start the container with bind mount so that the logs are created into your filesystem.

Submit your used commands for this exercise.

### 1.9 ###

In this exercise we won't create a new Dockerfile. 
Image `devopsdockeruh/ports_exercise` will start a web service in port `80`. Use -p flag to access the contents with your browser.

Submit your used commands for this exercise.

### 1.10 ###

<b style="color:firebrick;">This exercise is mandatory</b>

A good developer creates well written READMEs that can be used to create Dockerfiles with ease.

Clone, fork or download a project from <https://github.com/docker-hy/frontend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 5000 exposed and published so when you start the container and navigate to <http://localhost:5000> you will see message if you're successful.

Submit the Dockerfile.

*Do not alter the code of the project*

> TIP: The project has install instructions in README.

> TIP: You do not have to install anything new outside containers.

### 1.11 ###

<b style="color:firebrick;">This exercise is mandatory</b>

Clone, fork or download a project from <https://github.com/docker-hy/backend-example-docker>. 

Create a Dockerfile for the project and give a command so that the project runs in a docker container with port 8000 exposed and published so when you start the container and navigate to <http://localhost:8000> you will generate a message in logs.txt in the root.

Create a volume for the logs.txt so that when the application is shut down the logs are not destroyed. And when restarted it continues to write into the same logs.txt.

Submit the Dockerfile and the command used.

*Do not alter the code of the project*

### 1.12 ###

<b style="color:firebrick;">This exercise is mandatory</b>

Start both frontend-example and backend-example with correct ports exposed and configure the CMD or add ENV with necessary information from README. 
You know that the configuration is ready when the button for 1.7 of frontend-example responds.

*Do not alter the code of either project*

Submit the edited Dockerfiles and commands used to run.

![]({{ "/images/exercises/back-and-front.png" | absolute_url }})

> TIP: When configuring web applications keep browser developer console ALWAYS open, F12 or cmd+shift+I when the browser window is open. Information about configuring cross origin requests is in README of the backend project. 

> TIP: Developer console has multiple views, most important ones are Console and Network. Exploring the Network tab can give you a lot of information on where messages are being sent and what is received as response!

### 1.13 ###

Lets create a Dockerfile for a Java Spring project.

Setup Java Spring ?? project.

### 1.14 ###

Lets create a Dockerfile for a rails project.
Create a Dockerfile for rails project, use .dockerignore file.

### 1.15 ### 

Create Dockerfile for an application in any of your own repositories and publish it to Docker Hub. This can be any project except clones / forks of backend-example or frontend-example.

For this exercise to be complete you have to provide the link to the project in docker hub, make sure you have instructions in a README that's available through your submission.

### 1.16 ###

<b style="color:firebrick;">This exercise is mandatory</b>

Push `devopsdockeruh/exercise_1_??` to heroku.

### 1.17 ### 

Create an image that contains your favorite programming environment in it's entirety.

This means that a computer that only has docker can use the image to start a container which contains all the tools and libraries. Excluding IDE / Editor. The environment can be partially used by running commands manually inside the container.

Explain what you created and publish it to Docker Hub.

## Part 2 ##

*Do not alter the code of the projects, unless by pull-requests to the original projects*
*Exercises in part 2 should be done using docker-compose*

### 2. new_ex ###

Create a docker-compose.yml file that starts `devopsdockeruh/exercise_1_??`

### 2. new_ex ###

Container of `devopsdockeruh/exercise_1_??` will create logs into its `/usr/app/logs.txt`.

Create a docker-compose.yml file that starts `devopsdockeruh/exercise_1_??` and saves the logs into your filesystem.

### 2. new_ex ###

`devopsdockeruh/exercise_1_??` starts a web service that will answer in port `80`

Create a docker-compoy.yml and use it to start the service so that you can use it with your browser.

### 2.1 ###

<b style="color:firebrick;">This exercise is mandatory</b>

As we saw previously, starting an application with two programs was not trivial and the commands got a bit long.

Since we already created working Dockerfiles for both frontend and backend we can go step further and simplify the usage into one docker-compose.yml.

Configure the backend and frontend from part 1 to work in docker-compose.

Submit the docker-compose.yml

### 2.2 ### 

Add redis to example backend. 

Redis is used to speed up some operations. Backend uses a slow api to get information. You can test the slow api by requesting `/slow` with curl. The frontend program has a button to test this. Before configuring redis it should take 10 to 20 seconds to get a response.

Configure a redis container to cache information for the backend. Use the documentation if needed when configuring: <https://hub.docker.com/_/redis/>

The backend README should have all the information needed to connect.

When you've correctly configured it should take less than a second to get a response.

Submit the docker-compose.yml

![]({{ "/images/exercises/back-front-and-redis.png" | absolute_url }})

> `restart: unless-stopped` can help if the redis takes a while to get ready

> TIP for learning about containers that talk to each other:

> Go inside a container in the same way as in 1.3 and try using curl to send requests. At least in 2.4 and 2.5 it might be useful.

> Try it out by going inside redis (or 2.3 database) container and send a request to http://frontend-or-backend-container-name:relevant-port

### 2.3 ### 

Add database to example backend.

Lets use a postgres database to save messages. We won't need to configure a volume since the official postgres image sets a default volume for us. Lets use the postgres image documentation to our advantage when configuring: <https://hub.docker.com/_/postgres/>. Especially part Environment Variables is of interest.

The backend README should have all the information needed to connect.

Submit the docker-compose.yml

> TIP: When configuring the database, you might need to destroy the automatically created volumes. Use command `docker volume prune` to remove unused volumes when testing. Make sure to remove containers that depend on them beforehand.

> `restart: unless-stopped` can help if the postgres takes a while to get ready

![]({{ "/images/exercises/back-front-redis-and-database.png" | absolute_url }})

### 2. new_ex ###

Exercise 2. new_ex was created by [Sasu Mäkinen](https://github.com/sasumaki)

### 2.4 ### 

Configure a [machine learning](https://en.wikipedia.org/wiki/Machine_learning) project.

Look into machine learning project created with Python and React and split into three parts: [frontend](https://github.com/docker-hy/ml-kurkkumopo-frontend), [backend](https://github.com/docker-hy/ml-kurkkumopo-backend) and [training](https://github.com/docker-hy/ml-kurkkumopo-training) 

Note that the training requires 2 volumes and backend should share volume `/src/model` with training. 

The frontend will display on http://localhost:3000 and the application will tell if the subject of an image looks more like a cucumber or a moped.

Submit the docker-compose.yml

> Note that the generated model is a toy and will not produce good results.
> It will still take SEVERAL minutes to build the docker images, download training pictures and train the classifying model.

Exercise 2.4 was created by [Sasu Mäkinen](https://github.com/sasumaki)

### 2.5 ### 

Add nginx to example frontend + backend.

![]({{ "/images/exercises/back-front-redis-database-and-nginx.png" | absolute_url }})

Accessing your service from arbitrary port is counter intuitive since browsers use 80 (http) and 443 (https) by default. And having the service refer to two origins in a case where there's only one backend isn't desirable either. We will skip the SSL setup for https/443. 

Nginx will function as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) for us (see the image above). The requests arriving at anything other than /api will be redirected to frontend container and /api will get redirected to backend container. 

At the end you should see that the frontend is accessible simply by going to http://localhost and everything still works.

As we will not start configuring reverse proxies on this course you can have a simple config file:

The following file should be set to /etc/nginx/nginx.conf inside the nginx container. You can use a file volume where the contents of the file are the following:

```
events { worker_connections 1024; }

http {
  server {
    listen 80;

    location / {
      proxy_pass <frontend-connection-url>;
    }

    location /api/ {
      proxy_pass <backend-connection-url>;
    }
  }
}
```

Note that again inside the docker-compose network the connecting urls are usually form "http://hostname:port" where hostname and port are both known only inside the network.

Submit the docker-compose.yml

> Nginx specific information on why the api might not be found with your url: Leaving a trailing `/` out of your url will tell nginx to preserve the `location` in your url. So if you send a request to /api/ping the request will be proxied to /api/ping. If you have `/` as the final symbol of the url nginx will omit the `location`. So if you send a request to /api/ping the request will be proxied to /ping. The example backend will not answer to /api/ping.

### 2.6 ### 

Postgres image uses volume by default. Manually define volumes for redis and database in convenient locations. Use both image documentations (redis, postgres) to help you with the task. 

Try running `docker-compose down` and `docker-compose up` and see that the messages are still there and response time for api stays low. 

You can test that you've moved the volumes by deleting the folders from the place you decided to configure them in and running `docker-compose up`, all the data is gone. Maybe it would be simpler to back them up now that you know where they are.

Submit the docker-compose.yml

Make sure that every button for exercises that you did works in the frontend. If any one doesn't why not?

# Part 3

### 3.1 ### 

Return back to our frontend & backend Dockerfiles and you should see the some mistakes we now know to fix.

Document both image sizes at this point, as was done in the material. Optimize the Dockerfiles of both programs, frontend and backend, by joining the RUN commands and removing useless parts.

After your improvements document the image sizes again. The size difference may not be very much yet. The frontend should be around 432MB when using `FROM ubuntu:16.04`. The backend should be around 351MB. The sizes may vary.

### 3.2 ### 

We've used the youtube-dl a lot in the material but I believe that we should expand our horizons.

Create a new Dockerfile for [yle-dl](https://aajanki.github.io/yle-dl/) and optimize it. 

Use your application to download something to a volume without breaking the [YLE Terms of Service](https://ohjeet.areena.yle.fi/hc/fi/articles/115002969969-Yle-Areenan-k%C3%A4ytt%C3%B6ehdot)

Exercise 3.2 was created by [Terho Uotila](https://github.com/qzuw)

### 3.3 ###

<b style="color:firebrick;">This exercise is mandatory</b>

Security issues with the user being a root are serious for the example frontend and backend as the containers for web services are supposed to be accessible through the internet.

Make sure the containers start their processes as a non-root user.

### 3.4 ### 

Document the image size before the changes.

Rather than going to FROM alpine or scratch, lets go look into [docker-node](https://github.com/nodejs/docker-node) and we should find a way how to run a container that has everything pre-installed for us. Theres even a [best practices guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)

Return back to our frontend & backend Dockerfiles and change the FROM to something more suitable. Make sure the application still works after the changes.

Document the size after this change. If you used the alpine version the size for frontend can be less than 250MB. The backend can be below 150MB.

### 3.5 ###

Multi-stage builds. Lets do a multi-stage build for the frontend project.

Even though multi-stage builds are designed mostly for binaries in mind, we can leverage the benefits with our frontend project.

You can still use the `serve` to serve the static files or try out something else.

### 3.6 ### 

Do all of the optimizations from security to size for any other Dockerfile you have access to, in your own project or for example the ones used in exercises 1.8, 1.9, 2.4 or 3.2. Please document Dockerfiles both before and after.

### 3.7 ### 

In this exercise choose one of the following:

a) Write a short (200-300 words) text/article on why and when to use Kubernetes. You can compare it to other similar tools. A markdown file in your repository is the preferred format for submission. If you feel like sharing the article put a pull request to links section with a link to your text. 

b) Write a short (200-300 words) text/article on when to use Docker and what are the benefits. Write one example with and without containers. You can also write on any other container platform and compare it to Docker. A markdown file in your repository is the preferred format for submission. If you feel like sharing the article put a pull request to links section with a link to your text.

> TIP: Diagrams are often better than text when explaining container setups.

### 3.7 ### 

In this exercise choose one of the following:

a) Create an example setup that uses Kubernetes, Docker Swarm or equivalent using any project and deploy it online. You can use any applications available to you (such as the frontend - backend example). Make sure that the application consists of atleast two different containers that are deployed on two different hosts. 

You can practice deployment using virtual machines and AWS offers free credits for students.

b) Write a CLI tool to help you set up an environment and deploy it. (Helping with the complete deployment pipeline). This exercise can be done with any project of your choice. For example CLI tool automatically pulls your repositories, sets up databases / other services with Docker and contains relevant commands to reset the environment. (and when ready sends it to CI after which the image is build by docker hub and production server pulls it from there).

Add in explanation of the complete deployment pipeline with new developers in mind with the final steps containing production deployment instructions with Docker.

Explain your process and give a link to the repository in which the CLI tool exists.

c) Building images inside of a container. Create a project that downloads a repository from github, builds a Dockerfile located in the root and then publishes it into Docker Hub. Then create a Dockerfile for it. Make sure that it can build all of the example projects. Bonus (not required for a pass): use a webhook in the project so it is automatically triggered when changes are made into a specific branch.

