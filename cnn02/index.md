# Deep Learning Notes | Build CNNs with Tensorflow/Keras APIs


Two Classification Examples:

- Create a mood classifer using the TF Keras Sequential API (binary)
- Build a ConvNet to identify sign language digits using the TF Keras Functional API (multiclass)

### 0. Load Packages

```python
import math
import numpy as np
import h5py
import matplotlib.pyplot as plt
import scipy
from PIL import Image
from scipy import ndimage
import tensorflow as tf
from tensorflow.python.framework import ops
from cnn_utils import *

%matplotlib inline
np.random.seed(1)

```

### 1. Build a Mood Classifier

```python
X_train_orig, Y_train_orig, X_test_orig, Y_test_orig, classes = load_happy_dataset()

# Normalize image vectors
X_train = X_train_orig/255.
X_test = X_test_orig/255.

# Reshape
Y_train = Y_train_orig.T
Y_test = Y_test_orig.T

# Visualize
f, axarr = plt.subplots(1,2)

# use the created array to output your multiple images. In this case I have stacked 4 images vertically
axarr[0].imshow(X_train_orig[9])
axarr[1].imshow(X_train_orig[124])

print ("y = " + str(np.squeeze(Y_train_orig[:, 9]))
    + " and " + str(np.squeeze(Y_train_orig[:, 124]))
    )

```

{{< figure src="/images/cnn/smile.png" width="400">}}

#### 1.1. TF Keras Sequential API

This API allows us to build layer by layer with exactly one input tensor and one output tensor

- Sequential layers are ordered, and the order in which they are specified matters.
- If the model is non-linear or contains layers with multiple inputs or outputs, a Sequential model wouldn't be the right choice!

```python
def happyModel():
    """
    Implements the forward propagation for the binary classification model:

    ZEROPAD2D -> CONV2D -> BATCHNORM -> RELU -> MAXPOOL -> FLATTEN -> DENSE

    Note that for simplicity and grading purposes, you'll hard-code all the values
    such as the stride and kernel (filter) sizes.
    Normally, functions should take these values as function parameters.

    Arguments:
    None
    Returns:
    model -- TF Keras model (object containing the information for the entire training process)
    """
    model = tf.keras.Sequential([
        ## 1. ZeroPadding2D with padding 3, input shape of 64 x 64 x 3
        tf.keras.layers.ZeroPadding2D(padding=(3,3),input_shape=(64, 64, 3), data_format="channels_last"),
        ## 2. Conv2D with 32 7x7 filters and stride of 1
        tf.keras.layers.Conv2D(32, (7, 7), strides = (1, 1), name = 'conv0'),
        ## 3. BatchNormalization for axis 3
        tf.keras.layers.BatchNormalization(axis = 3, name = 'bn0'),
        ## 4.ReLU
        tf.keras.layers.ReLU(max_value=None, negative_slope=0.0, threshold=0.0),
        ## 5. Max Pooling 2D with default parameters
        tf.keras.layers.MaxPooling2D((2, 2), name='max_pool0'),
        ## 6. Flatten layer
        tf.keras.layers.Flatten(),
        ## 7. Dense layer with 1 unit for output & 'sigmoid' activation
        tf.keras.layers.Dense(1, activation='sigmoid', name='fc'),
        ])

    return model
```

#### 1.2. Model Comiple and Summary

```python
happy_model = happyModel()
happy_model.compile(optimizer='adam',
                   loss='binary_crossentropy',
                   metrics=['accuracy'])
happy_model.summary()
```

{{< figure src="/images/cnn/summary.png" width="400">}}

#### 1.3. Train and Evaluate Model

Use .evaluate() to evaluate against the test set. This function will print the value of the loss function and the performance metrics specified during the compilation of the model.

```python
happy_model.fit(X_train, Y_train, epochs=100, batch_size=16)
happy_model.evaluate(X_test, Y_test)
```

### 2. Differentiate between 6 sign language digits.

```python
X_train_orig, Y_train_orig, X_test_orig, Y_test_orig, classes = load_signs_dataset()
X_train = X_train_orig/255.
X_test = X_test_orig/255.

Y_train = convert_to_one_hot(Y_train_orig, 6).T
Y_test = convert_to_one_hot(Y_test_orig, 6).T
```

{{< figure src="/images/cnn/SIGNS.png" width="400">}}

#### 2.1. Functional API

The Functional API can handle models with **non-linear topology**, _shared layers_, as well as layers with multiple inputs or outputs.

- Where Sequential is a straight line, a Functional model is a graph, where the nodes of the layers can connect in many more ways than one.

{{< figure src="/images/cnn/seq_vs_func.png" width="400">}}

```python
def convolutional_model(input_shape):
    """
    Implements the forward propagation for the model:
    CONV2D -> RELU -> MAXPOOL -> CONV2D -> RELU -> MAXPOOL -> FLATTEN -> DENSE

    Note that for simplicity and grading purposes, you'll hard-code some values
    such as the stride and kernel (filter) sizes.
    Normally, functions should take these values as function parameters.

    Arguments:
    input_img -- input dataset, of shape (input_shape)

    Returns:
    model -- TF Keras model (object containing the information for the entire training process)
    """

    input_img = tf.keras.Input(shape=input_shape)
    ## CONV2D: 8 filters 4x4, stride of 1, padding 'SAME'
    Z1 = tf.keras.layers.Conv2D(filters = 8, kernel_size = (4,4), strides = (1,1), padding = 'same')(input_img)
    ## RELU
    A1 = tf.keras.layers.ReLU()(Z1)
    ## MAXPOOL: window 8x8, stride 8, padding 'SAME'
    P1 = tf.keras.layers.MaxPool2D(pool_size=(8,8), strides=(8,8), padding='same')(A1)
    ## CONV2D: 16 filters 2x2, stride 1, padding 'SAME'
    Z2 = tf.keras.layers.Conv2D(filters = 16, kernel_size = (2,2), strides = (1,1), padding = 'same')(P1)
    ## RELU
    A2 = tf.keras.layers.ReLU()(Z2)
    ## MAXPOOL: window 4x4, stride 4, padding 'SAME'
    P2 = tf.keras.layers.MaxPool2D(pool_size=(4,4), strides=(4,4), padding='same')(A2)
    ## FLATTEN
    F = tf.keras.layers.Flatten()(P2)
    ## Dense layer:
    ## Apply a fully connected layer with 6 neurons and a softmax activation.
    outputs = tf.keras.layers.Dense(units=6, activation='softmax')(F)

    model = tf.keras.Model(inputs=input_img, outputs=outputs)
    return model
```

#### 2.2. Model Compile and Summary

```python
conv_model = convolutional_model((64, 64, 3))
conv_model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
conv_model.summary()
```

{{< figure src="/images/cnn/summary2.png" width="400">}}

#### 2.3. Train and Visualize the Model

The `history` object is an output of the `.fit()` operation, and provides a record of **all the loss and metric values** in memory. It's stored as a dictionary that you can retrieve at `history.history`:

```python
train_dataset = tf.data.Dataset.from_tensor_slices((X_train, Y_train)).batch(64)
test_dataset = tf.data.Dataset.from_tensor_slices((X_test, Y_test)).batch(64)
history = conv_model.fit(train_dataset, epochs=100, validation_data=test_dataset)

df_loss_acc = pd.DataFrame(history.history)
df_loss= df_loss_acc[['loss','val_loss']]
df_loss.rename(columns={'loss':'train','val_loss':'validation'},inplace=True)
df_acc= df_loss_acc[['accuracy','val_accuracy']]
df_acc.rename(columns={'accuracy':'train','val_accuracy':'validation'},inplace=True)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4), tight_layout=True)
df_loss.plot(title='Model loss',ax = ax1,figsize=(12,8)).set(xlabel='Epoch',ylabel='Loss')
df_acc.plot(title='Model Accuracy',ax = ax2,figsize=(12,8)).set(xlabel='Epoch',ylabel='Accuracy')
plt.show()
```

{{< figure src="/images/cnn/modelvis.png" width="400">}}

