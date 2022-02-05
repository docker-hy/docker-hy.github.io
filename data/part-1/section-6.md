---
path: "/part-1/6-docker-hub"
title: "Utilizing tools from the Registry"
hidden: false
---

As we've already seen it should be possible to containerize almost any project. As we are in between Dev and Ops let's pretend again that some developer teammates of ours did an application with a README that instructs what to install and how to run the application. Now we as the container experts can containerize it in seconds. Open this `https://github.com/docker-hy/material-applications/tree/main/rails-example-project` project and read through the README and think about how to transform it into a Dockerfile. Thanks to the README we should be able to decipher what we will need to do even if we have no clue about the language or technology!

We will need to clone the repository, which you may have already done. After the project is done, let's start with a Dockerfile. We know that we need to install ruby and whatever dependencies it had. Let's place the Dockerfile in the project root.

**Dockerfile**

```Dockerfile
# We need ruby 3.1.0. I found this from Docker Hub
FROM ruby:3.1.0

EXPOSE 3000

WORKDIR /usr/src/app
```

Ok these are the basics, we have FROM a ruby version, EXPOSE 3000 was told at the bottom of the README and WORKDIR /usr/src/app is the convention.

```Dockerfile
# Install the correct bundler version
RUN gem install bundler:2.3.3

# Copy the files required for dependencies to be installed
COPY Gemfile* ./

# Install all dependencies
RUN bundle install
```

Here I do a quick trick to separate installing dependencies from the part where we copy the source code in. The COPY will copy both Gemfile and Gemfile.lock to the current directory. This will help us by caching the dependency layers if we ever need to make changes to the source code. The same kind of caching trick works in many other languages or frameworks, such as Node.js.

The next were told to us by the README. We won't need to copy anything from outside of the container to run these.

```Dockerfile
# Copy all of the source code
COPY . .

# We pick the production guide mode since we have no intention of developing the software inside the container.
# Run database migrations by following instructions from README
RUN rails db:migrate RAILS_ENV=production

# Precompile assets by following instructions from README
RUN rake assets:precompile

# And finally the command to run the application
CMD ["rails", "s", "-e", "production"]
```

And finally, we copy the project and follow the instructions in the README.

Ok. Let's see how well monkeying the README worked for us: `docker build . -t rails-project && docker run -p 3000:3000 rails-project`. After a while of waiting, the application starts in port 3000 in production mode.

<exercise name="Exercise 1.11: Spring">

Create a Dockerfile for an old Java Spring project: [GitHub page](https://github.com/docker-hy/material-applications/tree/main/spring-example-project)

The setup should be straightforward with the README instructions. Tips to get you started:

Use [openjdk image](https://hub.docker.com/_/openjdk) `FROM openjdk:_tag_` to get Java instead of installing it
manually. Pick the tag by using the README and Docker Hub page.

You've completed the exercise when you see a 'Success' message in your browser.

Submit the Dockerfile you used to run the container.

</exercise>

The following three exercises will start a larger project that we will configure in parts 2 and 3. They will require you to use everything you've learned up until now. If you need to modify a Dockerfile in some later exercises, feel free to do it on top of the Dockerfiles you create here.

<exercise name="Exercise 1.12: Hello, frontend!">

<b style="color:firebrick;">This exercise is mandatory</b>

A good developer creates well-written READMEs. Such that they can be used to create Dockerfiles with ease.

Clone, fork or download the project from
[https://github.com/docker-hy/material-applications/tree/main/example-frontend](https://github.com/docker-hy/material-applications/tree/main/example-frontend).

Create a Dockerfile for the project (example-frontend) and give a command so that the project runs in a docker container with port 5000
exposed and published so when you start the container and navigate to [http://localhost:5000](http://localhost:5000)
you will see message if you're successful.

Submit the Dockerfile.

_As in other exercises, do not alter the code of the project_

* TIP: The project has install instructions in README.

* TIP: Note that the app starts to accept connections when "Accepting connections at http://localhost:5000" has been printed to the screen, this takes a few seconds

* TIP: You do not have to install anything new outside containers.

</exercise>

<exercise name="Exercise 1.13: Hello, backend!">

<b style="color:firebrick;">This exercise is mandatory</b>

Clone, fork or download a project from
[https://github.com/docker-hy/material-applications/tree/main/example-backend](https://github.com/docker-hy/material-applications/tree/main/example-backend).

Create a Dockerfile for the project (example-backend). Start the container with port 8080 published.

When you start the container and navigate to [http://localhost:8080/ping](http://localhost:8080/ping) you should get a "pong" as response.

Submit the Dockerfile and the command used.

_Do not alter the code of the project_

</exercise>

<exercise name="Exercise 1.14: Environment">

<b style="color:firebrick;">This exercise is mandatory</b>

Start both frontend-example and backend-example with correct ports exposed and add ENV to Dockerfile with necessary
information from both READMEs
([front](https://github.com/docker-hy/material-applications/tree/main/example-frontend),[back](https://github.com/docker-hy/material-applications/tree/main/example-backend)).

Ignore the backend configurations until frontend sends requests to `_backend_url_/ping` when you press the button.

You know that the configuration is ready when the button for 1.14 of frontend-example responds and turns green.

_Do not alter the code of either project_

Submit the edited Dockerfiles and commands used to run.

<img src="../img/exercises/back-and-front.png" />

The frontend will first talk to your browser. Then the code will be executed from your browser and that will send a message to backend.

<img src="../img/exercises/about-connection-front-back.png" />

* TIP: When configuring web applications keep browser developer console ALWAYS open, F12 or cmd+shift+I when the browser window is open. Information about configuring cross origin requests is in README of the backend project.

* TIP: Developer console has multiple views, most important ones are Console and Network. Exploring the Network tab can give you a lot of information on where messages are being sent and what is received as response!

</exercise>

# Publishing projects

Go to <https://hub.docker.com/> to create an account. You can configure docker hub to build your images for you, but using `push` works as well.

Let's publish the youtube-dl image. Log in and navigate to your [dashboard](https://hub.docker.com/repositories) and press Create Repository. The namespace can be either your personal account or an organization account. For now, let's stick to personal accounts and write something descriptive such as youtube-dl to repository name. We will need to remember it in part 2.

Set visibility to _public_.

And the last thing we need is to authenticate our push by logging in:

```console
$ docker login
```

Next, you will need to rename the image to include your username, and then you can push it:

```console
$ docker tag youtube-dl <username>/<repository>
  ...

$ docker push <username>/<repository>
  ...
```

<exercise name="Exercise 1.15: Homework">

Create Dockerfile for an application or any other dockerised project in any of your own repositories and publish it to Docker Hub. This can be any project, except the clones or forks of backend-example or frontend-example.

For this exercise to be complete you have to provide the link to the project in Docker Hub, make sure you at least have a basic description and instructions for how to run the application in a [README](https://help.github.com/en/articles/about-readmes) that's available through your submission.

</exercise>

<exercise name="Exercise 1.16: Heroku">

Pushing to Heroku happens in a similar way.

You can deploy an existing project this time. The course material should work, so let's pull that first from `devopsdockeruh/coursepage`

Go to [https://www.heroku.com/](https://www.heroku.com/) and create a new app there and install Heroku CLI. You can find additional instructions from `Deploy` tab under `Container Registry`. Tag the pulled image as `registry.heroku.com/_app_/_process-type_`, process-type can be `web` for this exercise. The app should be your project name in Heroku.

Then push the image to Heroku with `docker push registry.heroku.com/_app_/web` and release it using the Heroku CLI: `heroku container:release web --app _app_` (you might need to login first: `heroku container:login`)

Heroku might take some time to get the application up and running.

For this exercise return the url in which the released application is.

You could also use the Heroku CLI to build and push, but since we didn't want to build anything this time it was easier to just tag the image.

</exercise>
