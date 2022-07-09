# Open3D Notes 02 | 3D Mesh Processing


### 1. Polygon Mesh

（WIKI）Compared to the Point Cloud geometry type, a Polygon Mesh is a collection of **Vertices, Edges, Faces(triangles and quadrilaterals), Polygons and Surfaces**

- the study of Polygon Meshes is a large sub-field 3D Computer Graphics and Geometric Modeling

{{< figure src="/images/open3d/02/01.png" width="400">}}

### 2. Read a 3D Mesh

```python
import open3d as o3d
import numpy as np

knot_mesh = o3d.data.KnotMesh()
mesh = o3d.io.read_triangle_mesh(knot_mesh.path)
mesh.paint_uniform_color([0.5, 0.1, 0.3])

print("Displaying mesh ...")
print(mesh)
# TriangleMesh with 1440 vertices and 2880 triangles.
print("Try to render a mesh with normals (exist: " +
      str(mesh.has_vertex_normals()) + ") and colors (exist: " +
      str(mesh.has_vertex_colors()) + ")")
# mesh.has_vertex_normals() = False
# mesh.has_vertex_colors() = False
o3d.visualization.draw([mesh])
```

{{< figure src="/images/open3d/02/02.png" width="400">}}

Since the current mesh does not have `normals` for _Vertices or Triangle faces_. So uniform color shading is used instead of a more sophisticated Phong shading.

### 3. Surface Normal Estimation and Paint

Use `mesh.compute_vertex_normals()` and `paint_uniform_color()`

```python
print("Computing normals and rendering it.")
mesh.compute_vertex_normals()
print(np.asarray(mesh.triangle_normals))
mesh.paint_uniform_color([1, 0.706, 0])
o3d.visualization.draw_geometries([mesh])
```

{{< figure src="/images/open3d/02/03.png" width="400">}}

### 4. Mesh Filtering

#### 4.1. Average Filter

```python
print('create noisy mesh')
knot_mesh = o3d.data.KnotMesh()
mesh_in = o3d.io.read_triangle_mesh(knot_mesh.path)
vertices = np.asarray(mesh_in.vertices)
noise = 5
vertices += np.random.uniform(0, noise, size=vertices.shape)
mesh_in.vertices = o3d.utility.Vector3dVector(vertices)
mesh_in.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh_in])
```

{{< figure src="/images/open3d/02/04.png" width="400">}}

```python
print('filter with average with 1 iteration')
mesh_out = mesh_in.filter_smooth_simple(
  number_of_iterations=1)
mesh_out.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh_out])
```

{{< figure src="/images/open3d/02/05.png" width="400">}}

#### 4.2. Laplacian Filter

```python
print('filter with Laplacian with 50 iterations')
mesh_out = mesh_in.filter_smooth_laplacian(number_of_iterations=50)
mesh_out.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh_out])
```

{{< figure src="/images/open3d/02/06.png" width="400">}}

#### 4.3. Taubin Filter

The problem with the _Average and Laplacian Filter_ is that they lead to a **shrinkage** of the triangle mesh.

- [Taubin1995] showed that the application of two Laplacian filters with different $\lambda$ parameters can prevent the mesh shrinkage.

```python
print('filter with Taubin with 100 iterations')
mesh_out = mesh_in.filter_smooth_taubin(number_of_iterations=100)
mesh_out.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh_out])
```

{{< figure src="/images/open3d/02/07.png" width="400">}}

### 5. Sampling

The simplest method is `sample_points_uniformly` that uniformly samples **points** from the _3D surface_ based on the triangle area.

- The parameter `number_of_points` defines how many points are sampled from the triangle surface.

```python
print("Displaying pointcloud using uniform sampling ...")
pcd = mesh.sample_points_uniformly(number_of_points=1000)
o3d.visualization.draw_geometries([pcd])
```

Uniform sampling can yield clusters of points on the surface, while a method called **Poisson disk sampling** can _evenly distribute the points_ on the surface.

```python
print("Displaying pointcloud using Poisson disk sampling ...")
pcd = mesh.sample_points_poisson_disk(
  number_of_points=1000, init_factor=5)
o3d.visualization.draw_geometries([pcd])
```

{{< figure src="/images/open3d/02/08.png" width="400">}}

### 6. Mesh Simplification

Mesh Simplification methods are used to represent a high-resolution mesh with fewer triangles and vertices, but the low-resolution mesh should still be close to the high-resolution mesh.

#### 6.1. Vertex Clustering

This method pools all vertices that fall into a voxel of a given size to a single vertex.

```python
print(
    f'Input mesh has {len(mesh_in.vertices)} vertices and {len(mesh_in.triangles)} triangles'
)
# Input mesh has 1440 vertices and 2880 triangles
o3d.visualization.draw_geometries([mesh_in])

voxel_size = max(mesh_in.get_max_bound() - mesh_in.get_min_bound()) / 32
print(f'voxel_size = {voxel_size:e}')
# voxel_size = 5.66

mesh_smp = mesh_in.simplify_vertex_clustering(
    voxel_size=voxel_size,
    contraction=o3d.geometry.SimplificationContraction.Average)
print(
    f'Simplified mesh has {len(mesh_smp.vertices)} vertices and {len(mesh_smp.triangles)} triangles'
)
# Simplified mesh has 1355 vertices and 2720 triangles
o3d.visualization.draw_geometries([mesh_smp])

voxel_size = max(mesh_in.get_max_bound() - mesh_in.get_min_bound()) / 16
print(f'voxel_size = {voxel_size:e}')
# voxel_size = 11.332
mesh_smp = mesh_in.simplify_vertex_clustering(
    voxel_size=voxel_size,
    contraction=o3d.geometry.SimplificationContraction.Average)
print(
    f'Simplified mesh has {len(mesh_smp.vertices)} vertices and {len(mesh_smp.triangles)} triangles'
)
# Simplified mesh has 860 vertices and 1773 triangles
o3d.visualization.draw_geometries([mesh_smp])
```

#### 6.2. Mesh Decimation

Open3D implements `simplify_quadric_decimation` that minimizes error quadrics (distances to neighboring planes).

```python
mesh_smp = mesh_in.simplify_quadric_decimation(target_number_of_triangles=6500)
print(
    f'Simplified mesh has {len(mesh_smp.vertices)} vertices and {len(mesh_smp.triangles)} triangles'
)
# Simplified mesh has 1440 vertices and 2880 triangles
o3d.visualization.draw_geometries([mesh_smp])

mesh_smp = mesh_in.simplify_quadric_decimation(target_number_of_triangles=1700)
print(
    f'Simplified mesh has {len(mesh_smp.vertices)} vertices and {len(mesh_smp.triangles)} triangles'
)
# Simplified mesh has 850 vertices and 1700 triangles
o3d.visualization.draw_geometries([mesh_smp])
```

### Reference

[1] http://www.open3d.org/docs/latest/tutorial/geometry/mesh.html  
[2] https://en.wikipedia.org/wiki/Polygon_mesh

