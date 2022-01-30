---
path: '/part-2/4-containers-in-development'
title: 'Containers in development'
hidden: false
---

Containers are not only great in production. They can be used in development environments as well and offer a number of benefits. The same works-on-my-machine problem is faced often when a new developer joins the team. Not to mention the headache of switching runtime versions or a local database!

In our team at the University of Helsinki, the target for all project development environments is to have the setup so that a new developer only needs to install docker to get started. Of course, the target is usually missed as you need things like your favorite text editor.

Even if your application is not completely containerized during development, containers can be of use. For example, say you need mongodb version 4.0.22 installed in port 5656. It's now oneliner: "docker run -p 5656:27017 mongo:4.0.22" (mongodb uses 27017 as default port).

Let's containerize my node development environment. This will need some insider knowledge of node. But here is a simplified explanation if you're not familiar: libraries are defined in `package.json` and `package-lock.json` and installed with `npm install`. npm is node package manager and node is the runtime. To run application with the packages we have script defined in package.json that instructs node to run index.js, the main/entry file in this case the script is executed with `npm start`. The application already includes code to watch for changes in the filesystem and restart the application if any changes are detected.

The project "node-dev-env" is here [https://github.com/docker-hy/material-applications/tree/main/node-dev-env](https://github.com/docker-hy/material-applications/tree/main/node-dev-env). I already included a development Dockerfile and a helpful docker-compose.

**Dockerfile**
```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY package* ./

RUN npm install
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  node-dev-env:
    build: . # Build with the Dockerfile here
    command: npm start # Run npm start as the command
    ports:
      - 3000:3000 # The app uses port 3000 by default, publish it as 3000
    volumes:
      - ./:/usr/src/app # Let us modify the contents of the container locally
      - node_modules:/usr/src/app/node_modules # A bit of node magic, this ensures the dependencies built for the image are not available locally.
    container_name: node-dev-env # Container name for convenience

volumes: # This is required for the node_modules named volume
  node_modules:
```

And that's it. We'll use volume to copy all source code inside the volume so CMD will run the application we're developing. Let's try it!

```console
$ docker-compose up
Creating network "node-dev-env_default" with the default driver
Creating volume "node-dev-env_node_modules" with default driver
Building node-dev-env
Step 1/4 : FROM node:14
...

Attaching to node-dev-env
node-dev-env    |
node-dev-env    | > dev-env@1.0.0 start /usr/src/app
node-dev-env    | > nodemon index.js
...

node-dev-env    | App listening in port 3000
```

Great! The initial start up is a bit slow. It is a lot faster now that the image is already built. We can rebuild the whole environment whenever we want with `docker-compose up --build`.

Let's see if the application works. Use browser to access [http://localhost:3000](http://localhost:3000), it should do a simple plus calculation with the query params.

However, the calulation doesn't make sense! Let's fix the bug. I bet it's this line right here [https://github.com/docker-hy/material-applications/blob/main/node-dev-env/index.js#L5](https://github.com/docker-hy/material-applications/blob/main/node-dev-env/index.js#L5)

When I change the line, on my host machine the application instantly notices that files have changed:

```console
▶ docker-compose up
Starting node-dev-env ... done
Attaching to node-dev-env
node-dev-env    |
node-dev-env    | > dev-env@1.0.0 start /usr/src/app
node-dev-env    | > nodemon index.js
node-dev-env    |
node-dev-env    | [nodemon] 2.0.7
node-dev-env    | [nodemon] to restart at any time, enter `rs`
node-dev-env    | [nodemon] watching path(s): *.*
node-dev-env    | [nodemon] watching extensions: js,mjs,json
node-dev-env    | [nodemon] starting `node index.js`
node-dev-env    | App listening in port 3000
node-dev-env    | [nodemon] restarting due to changes...
node-dev-env    | [nodemon] starting `node index.js`
node-dev-env    | App listening in port 3000
```

And now a page refresh shows that our code change fixed the issue. The development environment works.

The next exercise can be extremely easy or extremely hard. Feel free to have fun with it.

<exercise name="Exercise 2.11">

  Select a project that you already have and start utilizing containers in the development environment.

  Explain what you have done. It can be anything, ranging from having supporting docker-compose.yml to have services containerized to developing inside a container.

</exercise>
