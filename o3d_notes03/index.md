# Open3D Notes 03 | 3D Mesh to Point Cloud


### 1. Alpha Shapes

The alpha shape is a generalization of a convex hull.

#### 1.1. Convex Hull

The Convex Hull (凸包) of a point cloud is the _smallest convex set_ that contains all points.

- Open3D contains `compute_convex_hull()` that computes the convex hull of a point cloud

```python
bunny = o3d.data.BunnyMesh()
mesh = o3d.io.read_triangle_mesh(bunny.path)
mesh.compute_vertex_normals()
# Sample a Point Cloud from Mesh
pcd = mesh.sample_points_poisson_disk(number_of_points=2000)
# Compute the convex hull that is returned as a triangle mesh.
hull, _ = pcd.compute_convex_hull()
# Visualize the convex hull as a red LineSet.
hull_ls = o3d.geometry.LineSet.create_from_triangle_mesh(hull)
hull_ls.paint_uniform_color((1, 0, 0))
o3d.visualization.draw_geometries([pcd, hull_ls])
```

{{< figure src="/images/open3d/03/01.png" width="400">}}

#### 1.2. Parameter: `Alpha`

The "best" Alpha is found out by trial-and-error[3]

```python
tetra_mesh, pt_map = o3d.geometry.TetraMesh.create_from_point_cloud(pcd)
# Try Alpha = 0.5, 0.136, 0.037, 0.010
for alpha in np.logspace(np.log10(0.5), np.log10(0.01), num=4):
    print(f"alpha={alpha:.3f}")
    mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_alpha_shape(
        pcd, alpha, tetra_mesh, pt_map)
    mesh.compute_vertex_normals()
    o3d.visualization.draw_geometries([mesh], mesh_show_back_face=True)
```

{{< figure src="/images/open3d/03/02.png" width="400">}}

### 2. Ball Pivoting

Intuitively, think of a 3D ball _with a given radius_ that we drop on the point cloud.

- If it hits any 3 points (and it does not fall through those 3 points) it creates a triangles.
- Then, the algorithm _starts pivoting_ from the edges of the existing triangles and
  - every time it hits 3 points where the ball does not fall through, we create another triangle.

```python
# The method accepts a list of radii as parameter
# that corresponds to the radii of the individual balls
# that are pivoted on the point cloud.
radii = [0.005, 0.01, 0.02, 0.04]
rec_mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_ball_pivoting(
    pcd, o3d.utility.DoubleVector(radii))
o3d.visualization.draw_geometries([pcd, rec_mesh])
```

{{< figure src="/images/open3d/03/03.png" width="400">}}

### 3. Poisson Surface Reconstruction

The Poisson surface reconstruction methodsolves a regularized optimization problem to obtain a smooth surface.

- since the points of the PointCloud are also the vertices of the resulting triangle mesh, they produce non-smooth results without any modifications.

An important parameter of the function is _depth_

- that defines the **depth of the octree used** for the surface reconstruction and hence implies the **resolution of the resulting triangle mesh**.
- A higher depth value means a mesh with more details

```python
eagle = o3d.data.EaglePointCloud()
pcd = o3d.io.read_point_cloud(eagle.path)

print(pcd) # PointCloud with 796825 points.
o3d.visualization.draw_geometries([pcd])
print('run Poisson surface reconstruction')
with o3d.utility.VerbosityContextManager(
        o3d.utility.VerbosityLevel.Debug) as cm:
    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=9)
print(mesh)
# TriangleMesh with 563112 points and 1126072 triangles.
o3d.visualization.draw_geometries([mesh])
```

{{< figure src="/images/open3d/03/04.png" width="400">}}

#### Remove Low Density Vertices

Poisson surface reconstruction will also create triangles in areas of _low point density_, and even extrapolates into some areas (see _bottom of the eagle_ output above).

- The ` create_from_point_cloud_poisson()`` function has a  `densities` return value that indicates for each vertex the density.
- A _low density value_ means that the vertex is only supported by a _low number of points_ from the input point cloud.

```python
print('visualize densities')
densities = np.asarray(densities)
density_colors = plt.get_cmap('plasma')(
    (densities - densities.min()) / (densities.max() - densities.min()))
density_colors = density_colors[:, :3]

density_mesh = o3d.geometry.TriangleMesh()
density_mesh.vertices = mesh.vertices
density_mesh.triangles = mesh.triangles
density_mesh.triangle_normals = mesh.triangle_normals

density_mesh.vertex_colors = o3d.utility.Vector3dVector(density_colors)
o3d.visualization.draw_geometries([density_mesh])
```

{{< figure src="/images/open3d/03/05.png" width="400">}}

- Violet indicates low density and yellow indicates a high density.

```
print('remove low density vertices')
# remove all vertices (and connected triangles)
# that have a lower density value
# than the 0.01 quantile of all density values.
vertices_to_remove = densities < np.quantile(densities, 0.01)
mesh.remove_vertices_by_mask(vertices_to_remove)
print(mesh)
# TriangleMesh with 557480 points and 1113213 triangles.
# before: TriangleMesh with 563112 points and 112
```

### Reference

[1] http://www.open3d.org/docs/latest/tutorial/geometry/surface_reconstruction.html  
[2] https://github.com/isl-org/Open3D/tree/master/examples/python/geometry  
[3] https://graphics.stanford.edu/courses/cs268-11-spring/handouts/AlphaShapes/as_fisher.pdf

