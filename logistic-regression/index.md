# Statistical Learning Notes | Logistic Regression, Cost Function, Gradient Descent


### 1. Binary Classification Example

Recall: Logistic Regression is an Algorithm for Binary Classification

An image is store in the computer in **three separate matrices**

- corresponding to the _Red, Green, and Blue color channels_ of the image.
- The three matrices have the same size as the image, for example, the resolution of the cat image is (64 pixels X 64 pixels), the three matrices (RGB) are 64 X 64 each.

{{< figure src="/images/deeplearning/log1.jpeg" width="600">}}

```python
import numpy as np
def image2vector(image):
    """
    Argument:
    image -- a numpy array of shape (length, height, depth)

    Returns:
    vector -- a vector of shape (length*height*depth, 1)
    """

    vector = image.reshape(image.shape[0]*image.shape[1]*image.shape[2],1)

    return vector
```

### 2. Sigmoid Function for LR

Given $X \in \R^{n_x}$, we want $\hat{y} = P(y=1|x), \hat{y} \in [0,1]$

- Parameters: $w \in \R^{n_x}, b \in \R$
- Let $z = w^T x + b$
- Output:

$$\hat{y} = \sigma (z) = \frac{1}{1+e^z}$$

- if z positive infinity: $\sigma (z) \approx \frac{1}{1+0} = 1$
- if z negative infinity: $\sigma (z) \approx \frac{1}{1+\infty} = 0 $

```python
def sigmoid(z):
    """
    Compute the sigmoid of z

    Arguments:
    z -- A scalar or numpy array of any size.

    Return:
    s -- sigmoid(z)
    """
    s = 1/(1+np.exp(-z))
    return s
```

### Cost Function for Logistic Regression

Given m training data: {$(x^{(1)},y^{(1)}), \dots, (x^{(m)},y^{(m)})$}

**Loss Function**  
$$L(\hat{y}, y) = - (y \log(\hat{y}) + (1-y) \log(1-\hat{y}))$$

- if $y = 1$, $L(\hat{y}, y) = - \log(\hat{y})$, to make L as small as possible, let $\hat{y} \approx 1$
- if $y = 0$, $L(\hat{y}, y) = - \log(1-\hat{y})$, to make L as small as possible, let $\hat{y} \approx 0$

**Cost Function**

- Goal: Use **Gradient Descent** to _optimize the \_parameters_ w and b* to **minimize the Cost Function**:
  $$J(w,b)=\frac{1}{m}\sum^m*{i=1} L(\hat{y}^{(i)}, y^{(i)})$$
  $$= - \frac{1}{m}\sum^m\_{i=1} [y^{(i)}\log (\hat{y}^{(i)}) - (1-y^{(i)})\log (1-\hat{y}^{(i)})]$$
- the cost function is a **Convex Function** that has a Global (Minimum) Optimum point

### Gradient Descent

Start at the _Initial Point (w, b)_ and take a step in the _steepest downhill direction_

{{< figure src="/images/deeplearning/w2l4.jpeg" width="400">}}

```python
def initialize_with_zeros(dim):
    """
    This function creates a vector of zeros of shape (dim, 1) for w and initializes b to 0.

    Argument:
    dim -- size of the w vector we want (or number of parameters in this case)

    Returns:
    w -- initialized vector of shape (dim, 1)
    b -- initialized scalar (corresponds to the bias)
    """

    w = np.zeros((dim,1))
    b = 0
    assert(w.shape == (dim, 1))
    assert(isinstance(b, float) or isinstance(b, int))
    return w, b

dim = 2
w, b = initialize_with_zeros(dim)
print ("w = " + str(w))
print ("b = " + str(b))
'''
w = [[0.]
 [0.]]
b = 0
'''
```

#### Forward and Backward Propagation

```python
def propagate(w, b, X, Y):
    """
    Implement the cost function and its gradient for the propagation explained above

    Arguments:
    w -- weights, a numpy array of size (num_px * num_px * 3, 1)
    b -- bias, a scalar
    X -- data of size (num_px * num_px * 3, number of examples)
    Y -- true "label" vector (containing 0 if non-cat, 1 if cat) of size (1, number of examples)

    Return:
    cost -- negative log-likelihood cost for logistic regression
    dw -- gradient of the loss with respect to w, thus same shape as w
    db -- gradient of the loss with respect to b, thus same shape as b
    """

    m = X.shape[1]

    # FORWARD PROPAGATION (FROM X TO COST)
    A = sigmoid(np.dot(w.T,X) + b)              # compute activation
    cost = np.sum(((- np.log(A))*Y + (-np.log(1-A))*(1-Y)))/m  # compute cost
    # BACKWARD PROPAGATION (TO FIND GRAD)
    dw = (np.dot(X,(A-Y).T))/m
    db = (np.sum(A-Y))/m

    assert(dw.shape == w.shape)
    assert(db.dtype == float)
    cost = np.squeeze(cost)
    assert(cost.shape == ())

    grads = {"dw": dw,
             "db": db}

    return grads, cost
```

