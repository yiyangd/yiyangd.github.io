# Paper Notes 01 | ROCA: Robust CAD Model Retrieval and Alignment from a Single Image


## PaperNotes 01 ｜ ROCA (1)

代码：https://github.com/cangumeli/ROCA  
主页：https://cangumeli.github.io/ROCA  
论文：https://arxiv.org/abs/2112.01988

### 1. The first pass

5 Steps to quick scan to get a bird’s-eye view of the paper

#### Step 1. Read Title, Abstract and Intro

**Title:** ROCA: Robust _CAD Model Retrieval and Alignment_ from a Single Image (RGB)

**Abstract:**

- ROCA approach enables 3D perception of an observed scene from a 2D RGB observation, characterized as a lightweight, compact, clean CAD representation.
- 2 Cores:
  - Differentiable Alignment Optimization based on dense 2D-3D object correspondences
  - Procrustes Alignment
- Experiments:
  - Database: ScanNet
  - Result: ROCA improves from 9.5% to 17.6% in retrieval-aware CAD _alignment accuracy_

**Section 1. Introduction**

- 2D Perception Systems cannot "understand" geometric shape, structure, and pose of the objects in the scene, which is unlike the human perception system.
- There are some approaches to 3D object estimation, e.g. **Mesh R-CNN**

#### Step 2. Read the Section/Sub-section Headings

**Section 2. Related Work**

- 2D Object Recognition
- Monocular Depth Estimation
- Single-Image Shape Reconstruction
- CAD Model Retrieval and Alignment
  - Mask2CAD, Vid2CAD
- Learned Differentiable Pose Optimization

**Section 3. Method**

- 3.1. Overview
- 3.2. Object Recognition and Depth Estimation
- 3.3. Robust Differentiable CAD Alignment
  - Aggregating Region Features
  - Scale Regression
  - Initial Translation Estimation
  - Normalized Object Coordinates as Correspondences
  - Differentiable Robust Procrustes Optimization
- 3.4. Geometry-Aware CAD Retrieval
- 3.5. Implementation Details
  - Training
  - Inference
  - Implementation (PyTorch，Detectron2, PyTorch3D)

**Section 4. Results**

- 4.1. Data and Evaluation
  - Dataset: ScanNet25k, Scan2CAD
  - Alignment Accuracy
  - Retrieval-Aware Alignment Accuracy
- 4.2. Comparison to State of the Art
- 4.3. Ablations
  - Effect
  - Learned retrieval performance
  - Scaling to augmented training data
  - Limitations

#### Step 3. Glance at the Math Content

1. (3.2) authors apply an additional loss to focus on object depth estimation

2. in 3.3. authors use robust feature aggregation scheme to obtain a shape descriptor $e_i$

3. use predicted shape codes regress scale and optimize it an l1 loss

4. Initial translation estimation

Differentiable Procrustes Optimization

#### Step 4. Read the Conclusions (Section 5)

6 Sentences：

1. Three Keys in this Approach lead to more robust and accurate pose predictions

- Leveraging dense per-pixel depth
- Canonical Point Correspondences with Weighted Differentiable Procrustes Optimization

2. Authors hope this ROCA method accelerate developments in **3D perception** towards **content creation**, **mixed reality**, and domain transfer.

#### Step 5. Glance over the References

Mentally ticking off the ones you've already read:

- since this is the first paper I read....
- aha! I can tick off the last one!!!
  - [50] Qian-Yi Zhou, Jaesik Park, and Vladlen Koltun. Open3D: A modern library for 3D data processing. arXiv:1801.09847, 2018 ✅

