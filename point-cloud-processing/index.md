# 3D Vision Notes | Point Clouds Processing 01 | Introduction


### 1. Introduction and Basic Algorithm

{{< figure src="/images/pcd/pcd-1-1.jpg">}}

#### Classical Algorithms vs Deep Learning

| -             | Object Classification                               | Object Registration                                     | Object Detection                                    |
| ------------- | --------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| Classical     | Keypoint Detection<br>Keypoint Description<br>SVM   | Nearest Neighbor Search<br>Iterative Closest Point(ICP) | Background Removal<br>Clustering<br>Classification  |
| Deep Learning | Data Collection<br>Data Labeling<br>Train a Network | Data Collection<br>Data Labeling<br>Train a Network     | Data Collection<br>Data Labeling<br>Train a Network |

Note Lists:

1. Introduction and Basics Algorithms

- PCA and Kernel PCA
- Smoothing, Filtering and Downsampling

2. Nearest Neighbor Problem

- Binary Search Tree
- KD-Tree
- Octree

3. Clustering

- K-Means
- Gaussian Mixture Model (GMM)
- Expectation-Maximization (EM)
- Spectral Clustering

4. Model Fitting

- Meanshift & dbscan
- Robust Least Square
- Hough Transform
- RANSAC

5. Deep Learning on Point Cloud

- PointNet & PointNet++
- GCN
- Supplementary

6. 3D Object Detection

- RCNN, FastRCNN, FasterRCNN, SSD
- VoxelNet, PointPillars
- PointRCNN
- Frustum PointNet, PointPainting

7. 3D Feature Detection

- harris 2d, 3d, 6d
- ISS: Intrinsic Shape Signatures
- USIP
- SO-Net

8. 3D Feature Description

- PFH & FPFH
- SHOT
- 3D Match & Pe

9. Registration (!!!!)

- ICP:
- NDT: Normal Distribution Transform
- Registration by RANSAC with feature detection, description, matching

深度学习：简单却不太容易解释; 要理解传统方法

