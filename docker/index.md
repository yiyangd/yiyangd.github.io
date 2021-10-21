# Full Stack Notes | Dockers


### 1. What is Docker？

Docker is a tool for building, running and shipping applications in an isolated Environment

- Similar to VM
- Apps run in same environment
- Standard for software deployment (easier)

### 2. Containers vs Virtual Machines

Containers are an **abstraction** at the \*application layer\*\*

- that packages _code_ and _dependencies_ together.
- Multiple Containers can run on the SAME machine and share the _OS Kernel_ with other containers,
- each running as _isolated processes_ in User Space
- light and fast

Virtual machines are an **abstraction** of physical hardware turning one _server_ into _many server_.

- The hypervisor allows multiple VMs to run on a single machine.
- Each VM includes a full copy of an OS, the application, necessary binaries and libraries
  - taking up tens of GBs.
  - very slow to boot

{{< figure src="/images/docker/docker_vm.jpeg" width="600">}}

### 4. Installing Docker

{{< figure src="/images/docker/docker_version.jpg" width="600">}}

### 5. Images, Containers, and Ports

Docker Image is a template for creating an environment of users' choices

Take an application and dockerize so that it can be run by docker

- add Dockerfile which is a plain text file that includes instructions that docker uses to **package up** this application into an `image`

The **image** contains everything our application needs to run:

- a cut-down OS
- a runtime environment (eg. Node)
- application files
- third-party libraries
- environment variables

Container is an running instance of an Image

- container is a special kind of process because it has its own _file system_ which is provided by the image

#### Pulling nginx Image

