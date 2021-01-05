---
layout: page
title: Exercise tricks
inheader: no
permalink: /exercise_tricks/
order: 0
---

Hey, 

here I've collected tips that you can use to "brute force" your way through some of the exercises and other maybe useful ways to think about the problems without bloating the exercises page.

At this point you know what containers are when configuring: ISOLATED environments that talk to each other using TCP & UDP ports.

On your own computer you can use a command line tool called curl (among many others) to do a GET request. GET usually gets you something from where you sent that request.

So when you're figuring things out you can use the `docker container exec` from part 1 to go use bash / sh inside a container. And then use curl to poke into the instance just to see what happens.

For example if you have a process running in `container_A` you can it to send a request to `container_B`. You can go inside `container_A` and just guess where the process is and more often than not test curling. 

Before brute forcing everywhere lets think about it for a moment. First check the PORT at which the `container_B` has it's application. Lets say that it's in port 25565 and has published PORT 1234. It's been explained before but lets do this again, you basically have 4 choices:

- 1: `curl localhost:25565`
- 2: `curl localhost:1234`
- 3: `curl container_B:25565`
- 4: `curl container_B:1234`

Take a moment to think about 1 & 2. If you're an application (in this case curl) inside `container_A` and sending a request to localhost it's not going to leave the container. Then lets look at what publishing port means (-p 1234:25565). That's how you publish the containers port outside of the docker network and into your local machine! It has nothing to do with two container connecting into each other.

`Wait what? Didn't we just make two containers "Talk to each other" with the frontend and backend` This is where the handy images next to some of the exercises come in! Actually frontend CONTAINER never talks to backend CONTAINER or vice versa. Both containers talk to your browser so you needed to publish the ports.

Now that you've chosen the right option for curl how can you make sure it was the right one? The wrong one will answer with `connection refused`. The right one may answer with anything but in this course they'll always answer with something.

With love, Jami.