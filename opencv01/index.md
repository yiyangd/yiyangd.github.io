# OpenCV Notes 01 | Feature Detection


### 0. Understanding Features

What are the main features in an image? How can finding those features be useful to us?

#### Jigsaw Puzzle Game

- How do you play jigsaw puzzles?
- How do you arrange lots of scrambled image pieces into a big single image?
- How can you stitch a lot of natural images to a single image?

{{< figure src="/images/opencv/0.png" width="400">}}

Answers:

- We are looking for _specific patterns_ or _specific features_ which are **unique**, can be **easily tracked and can be easily compared**.
- A and B are flat surfaces and they are spread over a lot of area.
  - It is **difficult to find** the exact location of these patches.
- C and D are **edges of the building**. You can find an approximate location, but exact location is still difficult.
  - This is because the pattern is same everywhere along the edge.
  - An edge is therefore better feature compared to flat area, but not good enough.
- E and F are some **corners of the building**. And they can be easily found. So they can be considered as good features.
- 好的 Feature 难以被定义，但小孩子都可以做到 —— 那便是拼拼图先去拼的那四个角，边和独特的拼图块。

#### Feature Detection

Feature Detection is Looking for features (regions) in images which have **maximum variation when moved (by a small amount)** in all regions around it.

#### Feature Description

We take a region around the feature, we explain it in our own words,

- like **"upper part is blue sky, lower part is region from a building, on that building there is glass etc"**
- Once you have the features and its description, you can find same features in all images and align(match) them, stitch them together

### 1. Harris Corner Detection

Corners are regions in the image with large variation in intensity in all the directions.

- One early attempt to find these corners was done by Chris Harris & Mike Stephens in their paper _A Combined Corner and Edge Detector_ in 1988,
- so now it is called the Harris Corner Detector.

#### Concepts (Math)

#### OpenCV Implementation

OpenCV has the function `cv.cornerHarris()` for this purpose. Its arguments are:

- `img` - Input image. It should be grayscale and float32 type.
- `blockSize` - It is the size of neighbourhood considered for corner detection
  ksize - Aperture parameter of the Sobel derivative used.
- `alpha`- Harris detector free parameter in the equation.

```python
import numpy as np
import cv2 as cv
filename = 'left09.jpg'
img = cv.imread(filename)
gray = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
gray = np.float32(gray)
dst = cv.cornerHarris(gray,2,3,0.04)
#result is dilated for marking the corners, not important
dst = cv.dilate(dst,None)
# Threshold for an optimal value, it may vary depending on the image.
img[dst>0.01*dst.max()]=[0,0,255]
cv.imshow('dst',img)
if cv.waitKey(0) & 0xff == 27:
    cv.destroyAllWindows()
```

{{< figure src="/images/opencv/harris.png" width="400">}}

### Shi-Tomasi Corner Detector

Later in 1994, J. Shi and C. Tomasi made a small modification to it in their paper _Good Features to Track_ which shows better results compared to Harris Corner Detector.

- The scoring function in Harris Corner Detector was given by:
  $$R=\lambda_0 \lambda_1 - \alpha(\lambda_0 + \lambda_1)^2$$
- Instead of this, Shi-Tomasi proposed:
  $$R = min(\lambda_1, \lambda_2)$$

### Reference:

- https://docs.opencv.org/4.x/db/d27/tutorial_py_table_of_contents_feature2d.html
- https://docs.opencv.org/4.x/df/d54/tutorial_py_features_meaning.html

