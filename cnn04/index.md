# Deep Learning Notes | Transfer Learning with MobileNets


## Transfer Learning with MobileNets

Many machine learning methods work well ONLY under a common assumption: the training and test data are drawn from the same feature space and the same distribution.

- When the distribution changes, **most statistical models need to be rebuilt** from scratch _using newly collected training data_.
- In many realworld applications, it is expensive or impossible.
- In such cases, Transfer Learning between task domains would be desirable.

{{< figure src="/images/cnn/transfer.png" width="400">}}

This note illustrate steps of using transfer learning on a **pre-trained CNN** to build an Alpaca/Not Alpaca （羊驼识别） classifier!

- A **pre-trained model is a network** that's already been trained on a large dataset and saved, which allows us to _reuse the weights_ to customize our own model cheaply and efficiently.
- The one we'll be using, **MobileNetV2**, was designed to provide _fast and computationally efficient performance_
  - at deployment for _mobile and embedded applications_
- It's been pre-trained on _ImageNet_, a dataset containing over 14 million images and 1000 classes.

### 1. Create and Split the Dataset

```python
import matplotlib.pyplot as plt
import numpy as np
import os
import tensorflow as tf
import tensorflow.keras.layers as tfl

from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.layers.experimental.preprocessing import RandomFlip, RandomRotation

BATCH_SIZE = 32
IMG_SIZE = (160, 160)
directory = "dataset/"
train_dataset = image_dataset_from_directory(directory,
                                             shuffle=True,
                                             batch_size=BATCH_SIZE,
                                             image_size=IMG_SIZE,
                                             validation_split=0.2,
                                             subset='training',
                                             seed=42)

validation_dataset = image_dataset_from_directory(directory,
                                             shuffle=True,
                                             batch_size=BATCH_SIZE,
                                             image_size=IMG_SIZE,
                                             validation_split=0.2,
                                             subset='validation',
                                             seed=42)
```

- Found 327 files belonging to 2 classes.
- Using 262 files for training.
- Found 327 files belonging to 2 classes.
- Using 65 files for validation.

#### Visualize the Images

```python
class_names = train_dataset.class_names

plt.figure(figsize=(10, 10))
for images, labels in train_dataset.take(1):
    for i in range(9):
        ax = plt.subplot(3, 3, i + 1)
        plt.imshow(images[i].numpy().astype("uint8"))
        plt.title(class_names[labels[i]])
        plt.axis("off")
```

{{< figure src="/images/cnn/alpaca.png" width="400">}}

### 2. Preprocess and Augment Training Data

Using `prefetch()` _prevents a memory bottleneck_ that can occur when reading from disk. It sets aside some data and keeps it ready for when it's needed, by creating a source dataset from input data, applying a transformation to preprocess it, then iterating over the dataset one element at a time.

- Because the iteration is streaming, the data doesn't need to fit into memory.

Use `tf.data.experimental.AUTOTUNE` to choose the parameters automatically. `Autotune` prompts `tf.data` to tune that value dynamically at runtime, by tracking the time spent in each operation and feeding those times into an optimization algorithm.

- The optimization algorithm tries to find the best allocation of its CPU budget across all tunable operations.

```python
AUTOTUNE = tf.data.experimental.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
```

To increase diversity in the training set and help the model learn the data better,

- it's standard practice to **augment the images** by transforming them
  - i.e., **randomly flipping** and **rotating them**.
- `Keras' Sequential API` offers a straightforward method for these kinds of data augmentations, with built-in, customizable preprocessing layers.
- These layers are saved with the rest of your model and can be re-used later.

```python
def data_augmenter():
    '''
    Create a Sequential model composed of 2 layers
    Returns:
        tf.keras.Sequential
    '''
    data_augmentation = tf.keras.Sequential()
    data_augmentation.add(RandomFlip('horizontal'))
    data_augmentation.add(RandomRotation(0.2))

    return data_augmentation
####################################
data_augmentation = data_augmenter()

for image, _ in train_dataset.take(1):
    plt.figure(figsize=(10, 10))
    first_image = image[0]
    for i in range(9):
        ax = plt.subplot(3, 3, i + 1)
        augmented_image = data_augmentation(tf.expand_dims(first_image, 0))
        plt.imshow(augmented_image[0] / 255)
        plt.axis('off')
```

{{< figure src="/images/cnn/data_aug.png" width="400">}}

### 3. Using MobileNetV2 for Transfer Learning

MobileNetV2 was trained on ImageNet and is optimized to run on mobile and other low-power applications.

- It's 155 layers deep and very efficient for _object detection and image segmentation_ tasks, as well as classification tasks like this one.

{{< figure src="/images/cnn/mobilearch.jpeg" width="600">}}

The architecture has three defining characteristics:

- Depthwise separable convolutions
  - to _reduce the number of trainable parameters and operations_
- Thin input and output bottlenecks between layers
  - these bottlenecks encode the intermediate inputs and outputs in a low dimensional space,
  - and _prevent non-linearities_ from destroying important information.
- Shortcut connections between bottleneck layers
  - to speed up training and improving predictions.

{{< figure src="/images/cnn/mobilenet.png" width="400">}}

#### Speed up convolutions in two steps

**Depthwise Convolution** calculates an intermediate result

- by convolving on each of the channels independently.
- it provides _lightweight feature filtering and creation_
- deal with both spatial and depth (number of channels) dimensions

**Pointwise Convolution** merges the outputs of the previous step into one.

- This gets a single result from a single feature at a time,
- and then is applied to all the filters in the output layer.

```python
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

IMG_SHAPE = IMG_SIZE + (3,)
base_model = tf.keras.applications.MobileNetV2(input_shape=IMG_SHAPE,
                                               include_top=True,
                                               weights='imagenet')

base_model.summary()
```

{{< figure src="/images/cnn/mobile_summary.png" width="400">}}

#### Check Batch

The number 32 refers to the batch size and 1000 refers to the 1000 classes the model was pretrained on.

```python
image_batch, label_batch = next(iter(train_dataset))
feature_batch = base_model(image_batch)
print(feature_batch.shape) # (32, 1000)

#Shows the different label probabilities in one tensor
label_batch
'''
<tf.Tensor: shape=(32,), dtype=int32, numpy=
array([1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0], dtype=int32)>
'''
```

#### Predictions

The predictions returned by the base model below follow this format:

- First the class number, then a human-readable label, and last the probability of the image belonging to that class.
- there are two of these returned for each image in the batch - these the top two probabilities returned for that image.

```python
base_model.trainable = False
image_var = tf.Variable(image_batch)
pred = base_model(image_var)

tf.keras.applications.mobilenet_v2.decode_predictions(pred.numpy(), top=2)
```

Because MobileNet pretrained over ImageNet doesn't have the correct labels for `alpacas`, so using the full model will get a bunch of incorrectly classified images.

- Solution: delete the top layer, which contains all the classification labels, and create a new classification layer.

### 4. Modify Pretrained Model by Layer Freezing

To use a pretrained model to **modify the classifier** task so that it's able to recognize alpacas, we need:

- Delete the top layer (the classification layer)
  - `include_top=False`
- Add a new trained classifier layer by _freezing the rest of the network_
  - a single neuron is enough to solve a binary classification problem.
- Freeze the base model and train the newly-created classifier layer
  - `base_model.trainable=False`
  - `base_model(x, training=False)`

```python
def alpaca_model(image_shape=IMG_SIZE, data_augmentation=data_augmenter()):
    ''' Define a tf.keras model for binary classification out of the MobileNetV2 model
    Arguments:
        image_shape -- Image width and height
        data_augmentation -- data augmentation function
    Returns:
    Returns:
        tf.keras.model
    '''
    input_shape = image_shape + (3,)

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False, # <== Important!!!!
        weights='imagenet') # From imageNet

    # Freeze the base model by making it non trainable
    base_model.trainable = False
    # Create the input layer (Same as the imageNetv2 input size)
    inputs = tf.keras.Input(shape=input_shape)
    # Apply data augmentation to the inputs
    x = data_augmentation(inputs)
    # Data preprocessing using the same weights the model was trained on
    x = preprocess_input(x)
    # Set training to False to avoid keeping track of statistics in the batch norm layer
    x = base_model(x, training=False)
    # Add the new Binary classification layers
    # Use global avg pooling to summarize the info in each channel
    x = tfl.GlobalAveragePooling2D()(x)
    # Include dropout with probability of 0.2 to avoid overfitting
    x = tfl.Dropout(0.2)(x)

    # Use a prediction layer with one neuron (as a binary classifier only needs one)
    outputs = tfl.Dense(1)(x)

    model = tf.keras.Model(inputs, outputs)

    return model

model2 = alpaca_model(IMG_SIZE, data_augmentation)
for layer in summary(model2):
    print(layer)
'''
['InputLayer', [(None, 160, 160, 3)], 0]
['Sequential', (None, 160, 160, 3), 0]
['TensorFlowOpLayer', [(None, 160, 160, 3)], 0]
['TensorFlowOpLayer', [(None, 160, 160, 3)], 0]
['Functional', (None, 5, 5, 1280), 2257984]
['GlobalAveragePooling2D', (None, 1280), 0]
['Dropout', (None, 1280), 0, 0.2]
['Dense', (None, 1), 1281, 'linear']
'''

```

#### Model Compile and Visualize Accuracy

```python
base_learning_rate = 0.001
model2.compile(optimizer=tf.keras.optimizers.Adam(lr=base_learning_rate),
              loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              metrics=['accuracy'])

initial_epochs = 5
history = model2.fit(train_dataset, validation_data=validation_dataset, epochs=initial_epochs)

acc = [0.] + history.history['accuracy']
val_acc = [0.] + history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(8, 8))
plt.subplot(2, 1, 1)
plt.plot(acc, label='Training Accuracy')
plt.plot(val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.ylabel('Accuracy')
plt.ylim([min(plt.ylim()),1])
plt.title('Training and Validation Accuracy')

plt.subplot(2, 1, 2)
plt.plot(loss, label='Training Loss')
plt.plot(val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.ylabel('Cross Entropy')
plt.ylim([0,1.0])
plt.title('Training and Validation Loss')
plt.xlabel('epoch')
plt.show()
```

{{< figure src="/images/cnn/mobileacc.png" width="400">}}

Right Now, the modified model has learned the `class_names` for given training dataset

- `['alpaca', 'not alpaca']`

### 5. Fine-tuning the Final Layers

Fine-tuning the model by **re-running the optimizer in the last layers** can improve accuracy.

- a smaller learning rate takes smaller steps to _adapt it a little more closely_ to the new data.

In Transfer Learning, _unfreezing the layers at the end of the network_, and then re-training your model on the final layers _with a very low learning rate_.

- the low-level features can be kept the same, as they have common features for most images.
- _we want the high-level features adapt to new data_, which is rather like letting the network learn to detect features more related to new training data, such as **soft fur or big teeth**.
- the later layers are the part of the network that contain the fine details (_pointy ears, hairy tails_) that are more specific to problem.

```python
base_model = model2.layers[4]
base_model.trainable = True

# 155 layers are in the base model
print("Number of layers in the base model: ", len(base_model.layers))

# Fine-tune from this layer onwards
fine_tune_at = 120

# Freeze all the layers before the `fine_tune_at` layer
for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = None

# Define a BinaryCrossentropy loss function. Use from_logits=True
loss_function=tf.keras.losses.BinaryCrossentropy(from_logits=True)
# Define an Adam optimizer with a learning rate of 0.1 * base_learning_rate
optimizer = tf.keras.optimizers.Adam(learning_rate=base_learning_rate*0.1)
# Use accuracy as evaluation metric
metrics=['accuracy']


model2.compile(loss=loss_function,
              optimizer = optimizer,
              metrics=metrics)

fine_tune_epochs = 5
total_epochs =  initial_epochs + fine_tune_epochs

history_fine = model2.fit(train_dataset,
                         epochs=total_epochs,
                         initial_epoch=history.epoch[-1],
                         validation_data=validation_dataset)
```

#### Visualize Accuracy

```python
acc += history_fine.history['accuracy']
val_acc += history_fine.history['val_accuracy']

loss += history_fine.history['loss']
val_loss += history_fine.history['val_loss']

plt.figure(figsize=(8, 8))
plt.subplot(2, 1, 1)
plt.plot(acc, label='Training Accuracy')
plt.plot(val_acc, label='Validation Accuracy')
plt.ylim([0, 1])
plt.plot([initial_epochs-1,initial_epochs-1],
          plt.ylim(), label='Start Fine Tuning')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(2, 1, 2)
plt.plot(loss, label='Training Loss')
plt.plot(val_loss, label='Validation Loss')
plt.ylim([0, 1.0])
plt.plot([initial_epochs-1,initial_epochs-1],
         plt.ylim(), label='Start Fine Tuning')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.xlabel('epoch')
plt.show()
```

{{< figure src="/images/cnn/finetuneacc.png" width="400">}}

