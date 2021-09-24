# Full Stack Notes | Dockers


### 1. What is Docker？

Docker is a platform for building, running and shipping applications in a consistent manner

### 2. Virtual Machines vs Containers

### 3. Docker Architecture

### 4. Installing Docker

{{< figure src="/images/docker/docker_version.jpg" width="600">}}

### 5. Development WorkFlow

Take an application and dockerize so that it can be run by docker

- add Dockerfile which is a plain text file that includes instructions that docker uses to **package up** this application into an `image`

The **image** contains everything our application needs to run:

- a cut-down OS
- a runtime environment (eg. Node)
- application files
- third-party libraries
- environment variables

Use Docker to start a `container` using that image

- container is a special kind of process because it has its own _file system_ which is provided by the image

Run application locally on development machine by getting loaded inside a container/process

### 6. Docker in Action

### 7.

