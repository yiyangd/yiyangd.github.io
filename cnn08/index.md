# Deep Learning Notes | Art Generation with Neural Style Transfer


神经网络是通过梯度下降算法每一次优化（最小化）成本函数让训练集中的预测值接近真实值，每一次更新参数
optimize a cost function to get a set of parameter values. With Neural Style Transfer, you'll get to optimize a cost function to get pixel values. !

### 1. Neural Style Transfer

Neural Style Transfer (NST) uses a pre-trained convolutional network （VGG-19）, and optimizes a cost function to get pixel values updated.

- It merges two images, namely: a "content" image (C) and a "style" image (S), to create a "generated" image (G).
- The generated image G combines the "content" of the image C with the "style" of image S.

```python
import numpy as np
import tensorflow as tf
from tensorflow.python.framework.ops import EagerTensor
import pprint
pp = pprint.PrettyPrinter(indent=4)
img_size = 400
vgg = tf.keras.applications.VGG19(include_top=False,
                                  input_shape=(img_size, img_size, 3),
                                  weights='pretrained-model/vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5')

vgg.trainable = False
pp.pprint(vgg)
```

# 图片 1

#### 1.1. Build the Content Cost Function

The content cost function is computed using one hidden layer's activations.

#### Style Cost Function

The style cost function for one layer is computed using the Gram matrix of that layer's activations. The overall style cost function is obtained using several hidden layers.

#### Total Cost

