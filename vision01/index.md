# Depth Estimation | Chapter 12 of CV book


## 3d 视觉笔记 01 ｜ Depth Estimation

> 此篇笔记是「三维视觉笔记」系列的第 1 篇, 记录了 Richard Szeliski 教授的计算机视觉教材 —— 「Computer Vision: Algorithms and Applications」第二版的第 12 章 —— 深度估计

### 0. Introduction

**Stereo matching** (立体视觉匹配) is the process of taking two or more images and building a 3D model of the scene

- by finding _matching pixels_ in the images
- and converting their 2D positions into 3D depths.

> The word **stereo** comes from the Greek for **solid**; stereo vision is how we perceive solid shape (Koenderink 1990).

Question:How to build a **more complete** 3D model?

- Example: a _sparse or dense depth map_ that assigns relative depths to pixels in the input images.
- Solution: **Multi-view stereo algorithms** (多视图立体视觉) produce _complete 3D volumetric or surface-based object models_, as well as monocular depth recovery algorithms that infer plausible depths from just a single image.

