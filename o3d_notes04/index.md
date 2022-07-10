# Open3D Notes 04 | Create Point Clouds from RGBD Images


### 0. RGBD Images

An Open3D `RGBDImage` is composed of two images:

- `RGBDImage.depth` and `RGBDImage.color`
- We require the two images to _be registered into the same camera frame_ and have the same resolution.
- There are 3 well known **RGBD Datasets**:
  - Redwood
  - NYU
  - TUM

### 1. Redwood Dataset [Choi 2015]

The Redwood format stored depth in a 16-bit single channel image.

- The integer value represents the depth measurement in millimeters.
- It is the default format for Open3D to parse depth images.

#### 1.1. Read Dataset and Create an RGBDImage

The default conversion function `create_rgbd_image_from_color_and_depth()` creates an `RGBDImage` from a pair of color and depth image.

- The **color image** is converted into a _grayscale image_, stored in float ranged in [0, 1].
- The **depth image** is stored in float, representing the _depth value in meters_.

```python
redwood_rgbd = o3d.data.SampleRedwoodRGBDImages()
'''
[Open3D INFO] Downloading https://github.com/isl-org/open3d_downloads/releases/download/20220201-data/SampleRedwoodRGBDImages.zip
[Open3D INFO] Downloaded to /home/runner/open3d_data/download/SampleRedwoodRGBDImages/SampleRedwoodRGBDImages.zip
[Open3D INFO] Extracting /home/runner/open3d_data/download/SampleRedwoodRGBDImages/SampleRedwoodRGBDImages.zip.
[Open3D INFO] Extracted to /home/runner/open3d_data/extract/SampleRedwoodRGBDImages.
'''
color_raw = o3d.io.read_image(redwood_rgbd.color_paths[0])
depth_raw = o3d.io.read_image(redwood_rgbd.depth_paths[0])
rgbd_image = o3d.geometry.RGBDImage.create_from_color_and_depth(
    color_raw, depth_raw, convert_rgb_to_intensity=True)
print(rgbd_image)
'''
RGBDImage of size
Color image : 640x480, with 1 channels.
Depth image : 640x480, with 1 channels.
Use numpy.asarray to access buffer data.
'''
```

#### 1.2. Visualize RGBD Image

```python
import matplotlib.pyplot as plt
plt.subplot(1, 2, 1)
plt.title('Redwood grayscale image')
plt.imshow(rgbd_image.color)
plt.subplot(1, 2, 2)
plt.title('Redwood depth image')
plt.imshow(rgbd_image.depth)
plt.show()
## Or
# o3d.visualization.draw_geometries([rgbd_image])
```

{{< figure src="/images/open3d/04/01.png" width="400">}}

#### 1.3. Create Point Cloud from RGBD Image

The RGBD image can be converted into a point cloud, given a set of camera parameters.

- `PinholeCameraIntrinsicParameters.PrimeSenseDefault` has:
  - image resolution 640x480
  - focal length (fx, fy) = (525.0, 525.0)
  - optical center (cx, cy) = (319.5, 239.5)
- Default Extrinsic Parameter is an `identity matrix`

```python
pcd = o3d.geometry.PointCloud.create_from_rgbd_image(
    rgbd_image,
    o3d.camera.PinholeCameraIntrinsic(
        o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault))
# Flip it, otherwise the pointcloud will be upside down
pcd.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])
o3d.visualization.draw_geometries([pcd])
```

{{< figure src="/images/open3d/04/02.png" width="400">}}

### 2. SUN Dataset [Song2015]

{{< figure src="/images/open3d/04/03.png" width="400">}}

#### 2.1. Read and Visualize RGBD Image

```python
sun_rgbd = o3d.data.SampleSUNRGBDImage()
color_raw = o3d.io.read_image(sun_rgbd.color_path)
depth_raw = o3d.io.read_image(sun_rgbd.depth_path)
# Create RGBDImage
rgbd_image = o3d.geometry.RGBDImage.create_from_sun_format(color_raw, depth_raw)
# Visualization
o3d.visualization.draw_geometries([rgbd_image])
```

{{< figure src="/images/open3d/04/04.png" width="400">}}

#### 2.2. Create Point Cloud from RGBD Image

```python
pcd = o3d.geometry.PointCloud.create_from_rgbd_image(
    rgbd_image,
    o3d.camera.PinholeCameraIntrinsic(
        o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault))
# Flip it, otherwise the pointcloud will be upside down
pcd.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])
o3d.visualization.draw_geometries([pcd])
```

{{< figure src="/images/open3d/04/05.png" width="400">}}

### 3. TUM Dataset [Strum2012]

Set `convert_rgb_to_intensity=False`, we can visualize Color Image with 3 channels instead of Grayscale Image

```python
tum_data = o3d.data.SampleTUMRGBDImage()
color_raw = o3d.io.read_image(tum_data.color_path)
depth_raw = o3d.io.read_image(tum_data.depth_path)
rgbd_image = o3d.geometry.RGBDImage.create_from_tum_format(
    color_raw, depth_raw, convert_rgb_to_intensity=False)
o3d.visualization.draw_geometries([rgbd_image])
```

{{< figure src="/images/open3d/04/06.png" width="400">}}

```python
pcd = o3d.geometry.PointCloud.create_from_rgbd_image(
    rgbd_image,
    o3d.camera.PinholeCameraIntrinsic(
        o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault))
# Flip it, otherwise the pointcloud will be upside down
pcd.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])
o3d.visualization.draw_geometries([pcd])
```

{{< figure src="/images/open3d/04/07.png" width="400">}}

### 4. NYU Dataset [Silberman2012]

#### 4.1. Preprocess and Read Dataset

Since NYU images are not in standard `jpg` or `png` formats, we use `mpimg.imread` to read the **color image** as a _numpy array_ and convert it to an Open3D Image

- An additional helper function `read_nyu_pgm()` is called to **read depth images** from the _special big endian pgm format_ used in the NYU dataset.

```python
import matplotlib.image as mpimg
import re
# This is special function used for reading NYU pgm format
# as it is written in big endian byte order.
def read_nyu_pgm(filename, byteorder='>'):
    with open(filename, 'rb') as f:
        buffer = f.read()
    try:
        header, width, height, maxval = re.search(
            b"(^P5\s(?:\s*#.*[\r\n])*"
            b"(\d+)\s(?:\s*#.*[\r\n])*"
            b"(\d+)\s(?:\s*#.*[\r\n])*"
            b"(\d+)\s(?:\s*#.*[\r\n]\s)*)", buffer).groups()
    except AttributeError:
        raise ValueError("Not a raw PGM file: '%s'" % filename)
    img = np.frombuffer(buffer,
                        dtype=byteorder + 'u2',
                        count=int(width) * int(height),
                        offset=len(header)).reshape((int(height), int(width)))
    img_out = img.astype('u2')
    return img_out

print("Read NYU dataset")
# Open3D does not support ppm/pgm file yet. Not using o3d.io.read_image here.
# MathplotImage having some ISSUE with NYU pgm file. Not using imread for pgm.
nyu_rgbd = o3d.data.SampleNYURGBDImage()
color_raw = mpimg.imread(nyu_rgbd.color_path)
depth_raw = read_nyu_pgm(nyu_rgbd.depth_path)
color = o3d.geometry.Image(color_raw)
depth = o3d.geometry.Image(depth_raw)
rgbd_image = o3d.geometry.RGBDImage.create_from_nyu_format(color, depth)
```

#### 4.2. Visualize RGBD Images and Point Cloud

```python
o3d.visualization.draw_geometries([rgbd_image])

pcd = o3d.geometry.PointCloud.create_from_rgbd_image(
    rgbd_image,
    o3d.camera.PinholeCameraIntrinsic(
        o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault))
# Flip it, otherwise the pointcloud will be upside down
pcd.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])
o3d.visualization.draw_geometries([pcd])
```

{{< figure src="/images/open3d/04/08.png" width="400">}}

{{< figure src="/images/open3d/04/09.png" width="400">}}

### Reference:

[1] http://www.open3d.org/docs/release/tutorial/geometry/rgbd_image.html
[2] http://redwood-data.org/
[3] S. Choi, Q.-Y. Zhou, and V. Koltun. Robust reconstruction
of indoor scenes. In CVPR, 2015.
[4] S. Choi, Q.-Y. Zhou, S. Miller, and V. Koltun. A large dataset
of object scans. arXiv:1602.02481, 2016.
[5] http://rgbd.cs.princeton.edu/
[6] S. Song, S. Lichtenberg, and J. Xiao. SUN RGB-D: A RGB-D Scene Understanding Benchmark Suite
Proceedings of 28th IEEE Conference on Computer Vision and Pattern Recognition (CVPR2015)
[7] https://vision.in.tum.de/data/datasets/rgbd-dataset
[8] https://cs.nyu.edu/~silberman/datasets/nyu_depth_v2.html

