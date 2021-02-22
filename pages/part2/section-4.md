# Containers in development #

Containers are not only great in production. They can be used in development environments as well and offer a number of benefits. The same works-on-my-machine problem is faced often when a new developer joins the team. Not to mention the headache of switching runtime versions or a local database! 

In our team at the University of Helsinki the target for all project development environments is to have the new developer only install docker to get started. Of course the target is always missed, you need stuff like text editor. 

Even if your application isn't containerized during development say you need a new mongodb database running. For example mongodb version 4.0.22 in port 5656. It's an oneliner: "docker run -p 5656:27017 mongo:4.0.22". (mongodb uses 27017 as default port).

Let's containerize my node development environment. This will need some insider knowledge of node. But simplified explanaton if you're not familiar: libraries are defined in `package.json` and `package-lock.json` and installed with `npm install`. npm is node package manager and node is the runtime. To run application with the packages we have script defined in package.json that instructs node to run index.js, the main/entry file in this case the script is executed with `npm start`. The application already includes code to watch for changes in the filesystem and restart the application if any changes are detected.

The repository for my "node-dev-env-template" is here // TODO //. I already included a development Dockerfile in the dev directory.

```Dockerfile
FROM node:14

COPY package* ./

RUN npm install

CMD npm start
```

And that's it. We'll use volume to copy all source code inside the volume so CMD will run the application we're developing. Let's try it!

The next exercise can be extremely easy or extremely hard. Feel free to have fun with it.

{% include_relative exercises/2_11.html %}
