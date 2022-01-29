---
path: '/part-3/5-multi-host-environments'
title: 'Multi-host environments'
hidden: false
---

Now that we've mastered containers in small systems with docker-compose it's time to look beyond what the tools we practiced are capable of. In situations where we have more than a single host machine we cannot use docker-compose solely. However, Docker does contain other tools to help us with automatic deployment, scaling and management of dockerized applications.

In the scope of this course, we cannot go into how to use the tools in this section, but leaving them out would be a disservice.

**Docker swarm mode** is built into docker. It turns a pool of Docker hosts into a single virtual host. You can read the feature highlights [here](https://docs.docker.com/engine/swarm/). You can run right away with `docker swarm`. Docker swarm mode is the lightest way of utilizing multiple hosts.

**Docker Swarm** (not to be [confused with swarm mode](https://stackoverflow.com/questions/40039031/what-is-the-difference-between-docker-swarm-and-swarm-mode)) is a separate product for container orchestration on multiple hosts. It and other enterprise features were separated from Docker and sold to Mirantis late 2019. Initially, Mirantis [announced](https://www.mirantis.com/blog/mirantis-acquires-docker-enterprise-platform-business/) that support for Docker Swarm would stop after two years. However, in the months thereafter they decided to continue supporting and developing Docker Swarm without a definitive end-date. Read more [here](https://www.mirantis.com/blog/mirantis-will-continue-to-support-and-develop-docker-swarm/).

**Kubernetes** is the de facto way of orchestrating your containers in large multi-host environments. The reason being it's customizability, large community and robust features. However the drawback is the higher learning curve compared to Docker swarms. You can read their introduction [here](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/).

The main difference you should take is that the tools are at their best in different situations. In a 2-3 host environment for a hobby project the gains from Kubernetes might not be as large compared to a environment where you need to orchestrate hundreds of hosts with multiple containers each.

You can get to know Kubernetes with [k3s](https://k3s.io/) a lightweight Kubernetes distribution which you can run inside containers with [k3d](https://github.com/rancher/k3d). This is a great way to get started as you don't have to worry about any credit limits.

Rather than maintaining one yourself the most common way to use Kubernetes is by using a managed service by a cloud provider. Such as Google Kubernetes Engine (GKE) or Amazon Elastic Kubernetes Service (Amazon EKS) which are both offering some credits to get started.

<exercise name="Exercise 3.8: Kubernetes">

  Familiarize yourself with Kubernetes terminology and draw a diagram.

  Similarly to the networking diagrams in part 2. You will need to draw a diagram of at least three host machines in a Kubernetes cluster. The cluster is running two applications. The applications can be anything you want. An example could be a videogame server and a blog website.

  The applications may utilize other machines or APIs that are not part of the cluster. At least three of the machines should be utilized. Include "your own computer" in the diagram as the one sending instructions via kubectl to deploy an application. In addition include a HTTP message coming from the internet to your Kubernetes cluster and how it may reach an application.

  Make sure to label the diagram so that anyone else who has completed this exercise, and read the glossary, would understand it. The diagram should contain at least four of the following labels: Pod, Cluster, Container, Service and a Volume.

  [Glossary](https://kubernetes.io/docs/reference/glossary/?fundamental=true). And some [helpful diagrams](https://medium.com/@tsuyoshiushio/kubernetes-in-three-diagrams-6aba8432541c)

  I prefer to use [draw.io](https://draw.io) but you can use whichever tool you want.

</exercise>

<text-box name="DevOps with Kubernetes" variant="hint">

 If you're interested in Kubernetes you should join [DevOps with Kubernetes](https://devopswithkubernetes.com/), a free MOOC course just like this one.

</text-box>
