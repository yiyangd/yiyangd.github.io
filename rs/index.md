# RealSense RGB-Depth Camera Tutorial 01


## RealSense RGB-Depth Camera Tutorial 01

### 1. Streaming Depth

This example demonstrates how to start streaming depth frames from the camera and print the distance between

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

        # Print the distances
        for y in range(480):
            for x in range(640):
                dist = depth.get_distance(x,y)
                print(dist)
        break

    exit(0)
except Exception as e:
    print(e)
    pass

```

###

### 2. rs.pointcloud()

```python
# Generates 3D point clouds based on a depth frame.
pc = rs.pointcloud

```

#### rs.pointcloud()

