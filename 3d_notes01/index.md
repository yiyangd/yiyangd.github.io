# Open3D Notes | Coordinates and Transformation


## Open3D 笔记 01 ｜坐标与坐标的转换

> 这篇笔记是「Open3D 笔记」系列的第一篇，记录了我担心自己捡了芝麻丢了芝麻，所以一个芝麻一个芝麻地去捡。

### Vector3dVector()

```python
import open3d as o3d
import numpy as np

pcd = o3d.geometry.PointCloud()

np_points = np.array([
  [0,0,0], [0,0,1], [0,0,2], [0,0,3],
  [0,0,0], [1,0,0], [2,0,0], [2.2,0,0],
  [0,0,0], [0,1,0], [0,2,0], [0,5,0]
])

pcd.points = o3d.utility.Vector3dVector(np_points)

o3d.visualization.draw_geometries([pcd])
```

![](https://files.mdnice.com/user/1474/7bde2d50-0d61-4715-983a-51c5ccc03d68.png)

- 往【上】的坐标轴是 Y
- 往【右】的坐标轴是 X
- 往【“前”】的坐标轴是 Z

### Transformation

[1]http://www.open3d.org/docs/release/python_api/open3d.utility.Vector3dVector.html  
[2]

