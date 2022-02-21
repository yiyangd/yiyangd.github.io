# Deep Learning Notes | First CNN


## Build a Convlutional Neural Networks Step by Step

This Note logs how to implement the building blocks of a Convolutional Neural Network

- Convolution Functions: Zero Padding, Convolve Window, Convolution Forward/backward
- Pooling Functions: Pooling Forward, Create Mask, Distribute Value and Pooling backward

{{< figure src="/images/cnn/model.png" width="500">}}

### 0. Import Packages

```python
import numpy as np
import h5py
import matplotlib.pyplot as plt
from public_tests import *

%matplotlib inline
plt.rcParams['figure.figsize'] = (5.0, 4.0) # set default size of plots
plt.rcParams['image.interpolation'] = 'nearest'
plt.rcParams['image.cmap'] = 'gray'

%load_ext autoreload
%autoreload 2

np.random.seed(1)
```

### 1. Zero-Padding

Zero-padding adds zeros around the border of an image:
{{< figure src="/images/cnn/zero_pad.png" width="500">}}

The main **benefits of padding** are:

- allows to use a CONV layer without necessarily shrinking the height and width of the volumes.
  - This is important for building deeper networks, since otherwise the height/width would shrink as you go to deeper layers.
  - An important special case is the "same" convolution, in which the height/width is exactly preserved after one layer.
- helps to keep _more of the information at the border_ of an image.
  - Without padding, very few values at the next layer would be affected by pixels at the edges of an image.

```python
def zero_pad(X, pad):
    """
    Pad with zeros all images of the dataset X. The padding is applied to the height and width of an image,
    as illustrated in Figure 1.

    Argument:
    X -- python numpy array of shape (m, n_H, n_W, n_C) representing a batch of m images
    pad -- integer, amount of padding around each image on vertical and horizontal dimensions

    Returns:
    X_pad -- padded image of shape (m, n_H + 2 * pad, n_W + 2 * pad, n_C)
    """

    X_pad = np.pad(X, ((0,0), (pad, pad), (pad, pad), (0,0)), mode='constant', constant_values = (0,0))

    return X_pad

np.random.seed(1)
x = np.random.randn(4, 3, 3, 2) # x.shape
x_pad = zero_pad(x, 3) # x_pad.shape = (4, 9, 9, 2)
fig, axarr = plt.subplots(1, 2)
axarr[0].set_title('x')
axarr[0].imshow(x[0, :, :, 0])
axarr[1].set_title('x_pad')
axarr[1].imshow(x_pad[0, :, :, 0])
```

Output:  
{{< figure src="/images/cnn/zero_pad_output.png" width="500">}}

### 2. Single Step Filter of Convolution

Apply
{{< figure src="/images/cnn/Convolution_schematic.gif" width="500">}}

