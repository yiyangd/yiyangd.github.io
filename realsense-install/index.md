# Install Intel Realsense and Python Setup in 2022


Step 1: Search for IntelRealSense github

- https://github.com/IntelRealSense/librealsense

Step 2: Click the tag => release => latest

- https://github.com/IntelRealSense/librealsense/releases
- Click the latest tag (2.51.1 on Oct 9, 2022) and install the SDK on linux
- https://github.com/IntelRealSense/librealsense/blob/master/doc/distribution_linux.md

Step 3: Register the server's public key and add server to the list of repositories

{{< figure src="/images/librealsense_install/librealsense01.png" width="500">}}

Step 4: Install the libraries and the developer and debug packages

- `sudo apt-get install librealsense2-dkms`
- `sudo apt-get install librealsense2-utils`
- `sudo apt-get install librealsense2-dev`
- `sudo apt-get install librealsense2-dbg`

Step 5: Reconnect the Intel RealSense Depth Camera (D435i) and run:

- `realsense-viewer`

Step 6: Download/Clone librealsense github repo:

- `git clone https://github.com/IntelRealSense/librealsense.git`

Step 7: Install the core packages required to build librealsense binaries and the affected kernel modules

- `sudo apt-get install git libssl-dev libusb-1.0-0-dev libudev-dev pkg-config libgtk-3-dev`
- `sudo apt-get install libglfw3-dev libgl1-mesa-dev libglu1-mesa-dev at`

Step 8: Run the top level CMake command with additional FLAG

- `cd librealsense`
- `mkdir build && cd build`
- `cmake ../ -DFORCE_RSUSB_BACKEND=true -DBUILD_PYTHON_BINDINGS=true -DCMAKE_BUILD_TYPE=release -DBUILD_EXAMPLES=true -DBUILD_GRAPHICAL_EXAMPLES=true`
- `make -j4`
  - this step will take 20 minutes
- `sudo make install`

Step 9: Test a Python example

- `cd librealsense/wrapper/python/examples`
- `python export_ply_example.py`
- Note: you may need to `import pyrealsense2.pyrealsense2 as rs`

