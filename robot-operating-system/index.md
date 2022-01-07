# ROS Note | Install and Launch First ROS2 Program


ROS2 is expected to become mature and fully replace ROS1 by 2023.

- ROS2 `Foxy` Version released in June 2020 is mature and contain several advanced features (EOL: May 2023)
- ROS2 `Galactic` Version relased in May 2021, but EOL date is Nov 2022

ROS2 provides a `standard` for Robotic Applications

- any robots can be powered by ROS2

ROS2 provides a way of separating code into _reusable blocks_

- along with a set of _communication tools_ between programs
- "Plug and Play" Libraries => prevent us from reinventing the wheel

## 1. Installation

- https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Debians.html

### 1.1. Setup Locale

```shell
$ sudo apt update && sudo apt install locales
$ sudo locale-gen en_US en_US.UTF-8
$ sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
$ export LANG=en_US.UTF-8

$ locale  # verify settings
```

{{< figure src="/images/ros/locale.png" width="500">}}

### 1.2. Setup Sources

You will need to add the ROS 2 apt repositories to your system. To do so, first authorize our GPG key with apt like this:

```shell
$ sudo apt update && sudo apt install curl gnupg2 lsb-release
$ sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key  -o /usr/share/keyrings/ros-archive-keyring.gpg
```

And then add the repository to your sources list:

```shell
$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### 1.3. Install ROS 2 Packages

Update your apt repository caches after setting up the repositories.

```shell
$ sudo apt update
```

Desktop Install (Recommended): ROS, RViz, demos, tutorials.

- Sourcing the setup script automatically
- `source` is used to _refresh the current shell environment_ by running the bashrc file.
- it can also be used in order to _import functions into other bash scripts_ or to _run scripts_ into the current shell environment.

```shell
$ sudo apt install ros-foxy-desktop
$ sudo reboot
$ source /opt/ros/foxy/setup.bash
$ gedit ~/.bashrc
```

{{< figure src="/images/ros/source.png" width="500">}}

To check if we have installed sucessfully, we launch an existing example

```shell
$ ros2 run demo_nodes_cpp listener
$ ros2 run demo_nodes_cpp talker
```

{{< figure src="/images/ros/talker_listener.png" width="500">}}

## 2. Write and Launch the First ROS2 Program

### 2.1. Install the ROS2 Build Tool - Colcon

```shell
$ sudo apt install python3-colcon-common-extensions
```

Source the `argcomplete` feature:
{{< figure src="/images/ros/colcon.png" width="500">}}

### 2.2. Create a ROS2 Workspace

```shell
$ mkdir ros2_workspace
$ cd ros2_workspace/
$ mkdir src
$ colcon build
Summary: 0 packages finished
$ cd install/
$ source local_setup.bash
```

Add `source ~/ros2_workspace/install/setup.bash` via `gedit .bashrc`

#### 2.3. Create a Python Package

A `package` can be considered a `container` for your ROS 2 code.

- If you want to be able to `install` your code or `share` it with others, then you’ll need it organized in a package.
- With packages, you can release your ROS 2 work and allow others to build and use it easily.

Package creation in ROS 2 uses `ament` as its build system and `colcon` as its build tool.

- You can create a package using either `CMake` or `Python`, which are officially supported

```shell
$ cd ros2_workspace/src/
$ ros2 pkg create my_py_pkg --build-type ament_python --dependencies rclpy
```

Build packages in a workspace is especially valuable because you can **build many packages at once** by running `colcon build` in the workspace root.

- Otherwise, you would have to build each package individually.

```shell
$ cd ~/ros2_workspace
$ colcon build
$ colcon build --packages-select my_py_pkg
```

### 2.4. Write a Python Node

#### ROS2 Node

Each `node` in `ROS Network` should be responsible for a **single**, **module purpose**

- e.g. one node for **controlling wheel motors**, one node for **controlling a laser range-finder**, etc.
- Each node can _send and receive data_ to other nodes _via topics, services, actions, or parameters_.
- A full robotic system is comprised of many nodes working in concert.
- In ROS 2, a single executable (C++/Python program..) can contain one or more nodes.

{{< figure src="/images/ros/ros_network.jpg" width="500">}}

**Benefits:**

- Reduce Code Complexity
- Fault Tolerance
  - if one node crashes, it will NOT make the other nodes crash

#### Minimal Code

Create a new python file by `touch`

```shell
$ cd ~/ros2_workplace/src/my_py_pkg/my_py_pkg
$ touch my_first_node.py
```

In `my_first_node.py`

- `rcl`: ROS Client Library

```py
import rclpy
from rclpy.node import Node

def main(args=None):
    rclpy.init(args=args)
    node = Node("py_test")
    node.get_logger().info("Hello ROS2")
    rclpy.spin(node)
    rclpy.shutdown()


if __name__ == "__main__":
    main()

```

Execuate the Python Program

```shell
$ chmod +x my_first_node.py
$ ./my_first_node.py
```

Install the Excutable Node

- specify the executable name in `setup.py`

```python
entry_points={
  'console_scripts': [
    "py_node = my_py_pkg.my_first_node:main"
  ]
}
```

Then build again, before Executing `./py_node`, source the workspace

```shell
$ cd ros2_workspace/
$ colcon build --packages-select my_py_pkg
$ cd install/my_py_pkg/lib/my_py_pkg
$ source ~/.bashrc
$ ./py_node
```

The command `ros2 run` launches an `executable` from a `package`

```shell
$ source ~/.bashrc
$ ros2 run my_py_pkg py_node
[INFO] [xxx.xxx] [py_test]: Hello ROS2
```

#### Improve the Code Structure with OOP

Add a `timer_callback` functions

```python
import rclpy
from rclpy.node import Node
import time

class MyNode(Node):

  def __init__(self):
    super().__init__("pytest")
    self.counter_ = 0
    self.get_logger().info("Hello ROS2!")
    self.create_timer(1, self.timer_callback)

  def timer_callback(self):
    self.counter_ += 1
    self.get_logger().info("Hello " + str(self.counter_) + " " + str(time.ctime(time.time())))

def main(args=None):
    rclpy.init(args=args)
    node = MyNode()
    rclpy.spin(node)
    rclpy.shutdown()


if __name__ == "__main__":
    main()

```

**Output:**

{{< figure src="/images/ros/pynode.png" width="500">}}

#### Reference:

[1]https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Debians.html#  
[2]https://docs.ros.org/en/foxy/Tutorials/Workspace/Creating-A-Workspace.html  
[3]https://docs.ros.org/en/foxy/Tutorials/Creating-Your-First-ROS2-Package.html  
[4]https://docs.ros.org/en/foxy/Tutorials/Understanding-ROS2-Nodes.html

