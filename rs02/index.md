# RealSense RGB-Depth Camera Tutorial 02


I hope this note could finally solve the Point Cloud Segmentation + YOLO

#### Key Code

```python
import pyrealsense2.pyrealsense2 as rs

pc = rs.pointcloud()
points = rs.points()

points = pc.calculate(depth_frame)

vertices = np.asanyarray(points.get_vertices(dim=2))
```

#### Notes

`points = rs.points()`: Extends the frame class with additional point cloud related attributes and functions.

`points.get_vertices(dim=2)`: Retrieve the vertices of the point cloud

`o3d.utility.Vector3dVector(vertices_interest)`: Convert float64 numpy array of shape (n, 3) to Open3D format, 3 means x,y,z

#### Reference

https://intelrealsense.github.io/librealsense/python_docs/_generated/pyrealsense2.points.html?highlight=get_vertices

