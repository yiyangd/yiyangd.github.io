# ROS Note | Install and Launch First ROS2 Program


ROS2 is expected to become mature and fully replace ROS1 by 2023.

- ROS2 `Foxy` Version released in June 2020 is mature and contain several advanced features (EOL: May 2023)
- ROS2 `Galactic` Version relased in May 2021, but EOL date is Nov 2022

ROS2 provides a `standard` for Robotic Applications

- any robots can be powered by ROS2

ROS2 provides a way of separating code into _reusable blocks_

- along with a set of _communication tools_ between programs
- "Plug and Play" Libraries => prevent us from reinventing the wheel

### 1. Installation

- https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Debians.html

#### 1.1. Setup Locale

```shell
$ sudo apt update && sudo apt install locales
$ sudo locale-gen en_US en_US.UTF-8
$ sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
$ export LANG=en_US.UTF-8

$ locale  # verify settings
```

{{< figure src="/images/ros/locale.png" width="500">}}

#### 1.2. Setup Sources

You will need to add the ROS 2 apt repositories to your system. To do so, first authorize our GPG key with apt like this:

```shell
sudo apt update && sudo apt install curl gnupg2 lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key  -o /usr/share/keyrings/ros-archive-keyring.gpg
```

And then add the repository to your sources list:

```shell
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

#### 1.3. Install ROS 2 Packages

Update your apt repository caches after setting up the repositories.

```shell
sudo apt update
```

Desktop Install (Recommended): ROS, RViz, demos, tutorials.

- Sourcing the setup script automatically

```shell
sudo apt install ros-foxy-desktop
sudo reboot
source /opt/ros/foxy/setup.bash
gedit ~/.bashrc
```

{{< figure src="/images/ros/source.png" width="500">}}

To check if we have installed sucessfully, we launch an existing example

```shell
ros2 run demo_nodes_cpp listener
ros2 run demo_nodes_cpp talker
```

{{< figure src="/images/ros/talker_listener.png" width="500">}}

### 2. Write and Launch the First ROS2 Program

#### 2.1. Install the ROS2 Build Tool - Colcon

```shell

```

#### Reference:

