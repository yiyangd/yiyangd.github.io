# RealSense RGB-Depth Camera Tutorial 01


## RealSense RGB-Depth Camera Tutorial 01

### 1. Streaming Depth

This example demonstrates how to start streaming depth frames from the camera and display the image in the console as an ASCII art.

```python
#####################################################
## librealsense tutorial #1 - Accessing depth data ##
#####################################################

# First import the library
import pyrealsense2 as rs

try:
    # Create a context object. This object owns the handles to all connected realsense devices
    pipeline = rs.pipeline()

    # Configure streams
    config = rs.config()
    config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)

    # Start streaming
    pipeline.start(config)

    while True:
        # This call waits until a new coherent set of frames is available on a device
        # Calls to get_frame_data(...) and get_frame_timestamp(...) on a device will return stable values until wait_for_frames(...) is called
        frames = pipeline.wait_for_frames()
        depth = frames.get_depth_frame()
        if not depth: continue

        # Todo

    exit(0)
except Exception as e:
    print(e)
    pass
#except rs.error as e:
#    # Method calls agaisnt librealsense objects may throw exceptions of type pylibrs.error
#    print("pylibrs.error was thrown when calling %s(%s):\n", % (e.get_failed_function(), e.get_failed_args()))
#    print("    %s\n", e.what())
#    exit(1)

```

###

### 2. rs.pointcloud()

```python
# Generates 3D point clouds based on a depth frame.
pc = rs.pointcloud

```

#### rs.pointcloud()

Reference:
[1] https://community.intel.com/t5/Items-with-no-label/how-to-generate-pointclouds-and-draw-it-in-python/td-p/583731
[2] https://dev.intelrealsense.com/docs/rs-pointcloud
[3] https://dev.intelrealsense.com/docs/python2
[4] https://intelrealsense.github.io/librealsense/python_docs/_generated/pyrealsense2.html#module-pyrealsense2

