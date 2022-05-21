# Deep Learning Notes | FaceNet: CNN for Face Recognition/Verification


### 0. Two Problems:

**Face Verification (1:1 Matching):**

- Input: Image, name/ID
- Output: whether the input image is that of the claimed person (0/1 binary classification)
- e.g. passport/face match in airport and use face to unlock mobile phone

**Face Recognition (1:K Matching):**

- Has a database of K persons
- Input: image (a person's face)
- Output:
  - ID if the image is any of the K persons
  - or "not recognized"

### 1. FaceNet Introduction

FaceNet learns a neural network that encodes a face image into a output vector of 128 numbers.

- The network architecture follows the _Inception model_, uses 160x160 dimensional RGB images as its input
  - and uses a 128-neuron fully connected layer as its last layer, the model ensures that the output is an encoding vector of size 128.
- By comparing two such vectors and computing the distance `dist(encode(img1),encode(img2))`, you can then determine if two pictures are of the same person.

{{< figure src="/images/cnn/facenet02.jpg" width="400">}}

#### Model Training and Triplets Loss

Training will use **triplets** of images (A,P,N) :

- A is an "Anchor" image--a picture of a person.
- P is a "Positive" image--a picture of the same person as the Anchor image.
- N is a "Negative" image--a picture of a different person than the Anchor image.

For an image x, its **encoding** is denoted as `f(x)`, where f is the _Encoding Function_ computed by the Neural Network, to fit a good encoding, we want:

- minimize encoding distance of the same person
  - minimize `d(A,P)`
- maximize encoding distance of different persons
  - minimize `-d(A,N)`
- make sure that an image A of an individual is closer to the Positive P than to the Negative image N by at least a margin $\alpha$
  - $d(A,P) + \alpha \leq d(A,N)$

FaceNet is trained by **Minimizing the Triplet Loss**

$$\mathcal{J} = \sum^{m}_{i=1} \large[ \small \mid \mid f(A^{(i)}) - f(P^{(i)}) \mid \mid_2^2 - \mid \mid f(A^{(i)}) - f(N^{(i)}) \mid \mid_2^2+ \alpha \large ] \small_+ \tag{3}$$

```python
def triplet_loss(y_true, y_pred, alpha = 0.2):
    """
    Implementation of the triplet loss

    Arguments:
    y_true -- true labels, required when you define a loss in Keras, you don't need it in this function.
    y_pred -- python list containing three objects:
            anchor -- the encodings for the anchor images, of shape (None, 128)
            positive -- the encodings for the positive images, of shape (None, 128)
            negative -- the encodings for the negative images, of shape (None, 128)

    Returns:
    loss -- real number, value of the loss
    """

    anchor, positive, negative = y_pred[0], y_pred[1], y_pred[2]

    # Step 1: Compute the (encoding) distance between the anchor and the positive
    pos_dist = tf.reduce_sum(tf.square(tf.subtract(anchor,positive)), axis=-1)
    # Step 2: Compute the (encoding) distance between the anchor and the negative
    neg_dist = tf.reduce_sum(tf.square(tf.subtract(anchor,negative)), axis=-1)
    # Step 3: subtract the two previous distances and add alpha.
    basic_loss = tf.maximum(tf.add(tf.subtract(pos_dist,neg_dist), alpha), 0)
    # Step 4: Take the maximum of basic_loss and 0.0. Sum over the training examples.
    loss = tf.reduce_sum(basic_loss)

    return loss
```

### 2. Apply the Pre-Trained FaceNet Model

#### Load Model and Build Database

```python
from tensorflow.keras.models import model_from_json

json_file = open('keras-facenet-h5/model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
FRmodel = model_from_json(loaded_model_json)
FRmodel.load_weights('keras-facenet-h5/model.h5')

def img_to_encoding(image_path, model):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(160, 160))
    img = np.around(np.array(img) / 255.0, decimals=12)
    x_train = np.expand_dims(img, axis=0)
    embedding = model.predict_on_batch(x_train)
    return embedding / np.linalg.norm(embedding, ord=2)
# Create the database that maps each person's name to a 128-dimensional encoding of their face.
database = {}
database["person1"] = img_to_encoding("images/person1.png", FRmodel)
database["person2"] = img_to_encoding("images/person2.jpg", FRmodel)
database["personN"] = img_to_encoding("images/personN.jpg", FRmodel)
```

#### 2.1. Face Verification

```python
def verify(image_path, identity, database, model):
    """
    Function that verifies if the person on the "image_path" image is "identity".

    Arguments:
        image_path -- path to an image
        identity -- string, name of the person you'd like to verify the identity. Has to be an employee who works in the office.
        database -- python dictionary mapping names of allowed people's names (strings) to their encodings (vectors).
        model -- your Inception model instance in Keras

    Returns:
        dist -- distance between the image_path and the image of "identity" in the database.
        door_open -- True, if the door should open. False otherwise.
    """
    # Step 1: Compute the encoding for the image.
    encoding = img_to_encoding(image_path, model)
    # Step 2: Compute distance with identity's image
    dist = np.linalg.norm(encoding - database[identity])
    # Step 3: Open the door if dist < 0.7
    if dist < 0.7:
        print("It's " + str(identity) + ", welcome in!")
        door_open = True
    else:
        print("It's not " + str(identity) + ", please go away")
        door_open = False

    return dist, door_open
```

**Test**：

```python
verify("images/camera_0.jpg", "person1", database, FRmodel)
# It's person1, welcome in!
# (0.5992949, True) < 0.7
verify("images/camera_2.jpg", "personN", database, FRmodel)
# It's not personN, please go away
# (1.0259346, False) > 0.7
```

#### Face Recognition

```python
def who_is_it(image_path, database, model):
    """
    Implements face recognition for the office by finding who is the person on the image_path image.

    Arguments:
        image_path -- path to an image
        database -- database containing image encodings along with the name of the person on the image
        model -- your Inception model instance in Keras

    Returns:
        min_dist -- the minimum distance between image_path encoding and the encodings from the database
        identity -- string, the name prediction for the person on image_path
    """

    ## Step 1: Compute the target "encoding" for the image. Use img_to_encoding() see example above.
    encoding =  img_to_encoding(image_path, model)

    ## Step 2: Find the closest encoding
    # Initialize "min_dist" to a large value
    min_dist = 100

    # Loop over the database dictionary's names and encodings.
    for (name, db_enc) in database.items():

        # Compute L2 distance between the target "encoding" and the current db_enc from the database.
        dist = np.linalg.norm(encoding - db_enc)

        # If this distance is less than the min_dist, then set min_dist to dist, and identity to name.
        if dist < min_dist:
            min_dist = dist
            identity = name

    if min_dist > 0.7:
        print("Not in the database.")
    else:
        print ("it's " + str(identity) + ", the distance is " + str(min_dist))

    return min_dist, identity
```

Test:

```python
test1 = who_is_it("images/camera_0.jpg", database, FRmodel)
# it's personN, the distance is 0.5992949 (< 0.7)
```

#### References:

[1]Florian Schroff, Dmitry Kalenichenko, James Philbin (2015). FaceNet: A Unified Embedding for Face Recognition and Clustering

[2]Yaniv Taigman, Ming Yang, Marc'Aurelio Ranzato, Lior Wolf (2014). DeepFace: Closing the gap to human-level performance in face verification

This implementation also took a lot of inspiration from the official FaceNet github repository: https://github.com/davidsandberg/facenet

Further inspiration was found here: https://machinelearningmastery.com/how-to-develop-a-face-recognition-system-using-facenet-in-keras-and-an-svm-classifier/

And here: https://github.com/nyoki-mtl/keras-facenet/blob/master/notebook/tf_to_keras.ipynb

