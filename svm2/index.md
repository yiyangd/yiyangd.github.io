# SVM 2 - Support Vector Classifiers and Machines


## Support Vector Classifiers

### 2.1. Motivation

#### Disadvantages of Maximal Margin Classifier:

A classifier based on a separating hyperplane will necessarily perfectly classify _ALL_ of the training observations

- this can lead to _sensitivity_ to individual observations
  - a change in a single observation may lead to a dramatic change in the hyperplane
- it may have overfit the training data

#### Improvement:

Consider a classifier based on a hyperplane that does _NOT perfectly separate_ the two classes, in the interest of:

- Greater Robustness to individual observations, and
- Better Classification of _most_ of the training observations
  - may misclassify a few training data but may be worthwhile for trade-off

### 2.2. Support Vector Classifier

Rather than seeking the _largest_ possible margin so that every observation is _perfectly on the correct side_,

- Support Vector Classifier (Soft Margin Classifier) instead allows some observations to be _on the incorrect side_
  - Soft: margin can be violated by some of the training observations

#### Solve Optimization Problem

M is the width of the margin,

$$\max_{\beta_0,\beta_1,\cdots,\beta_p,\ \epsilon_1,\cdots,\epsilon_n,\ M} M$$
$$s.t. \sum_{j=1}^p \beta_j^2 = 1,$$
$$y_i(\beta_0 + \sum_{k=1}^p\beta_kx_{ik})\geq M(1-\epsilon_i),$$
$$\epsilon_i \geq 0, \ \sum_{i=1}^n\epsilon_i \leq C,$$

**Parameters:**

$\epsilon_i$ is _slack variable_ that allows individual observation to be on the _wrong side_ of the margin or the hyperplane

- it tells us where the ith observation is located, relative to the hyperplane and relative to the margin
  - if $\epsilon_i=0$ then the ith observation is on the correct side of the margin
  - if $\epsilon_i>0$ then the ith observation is on the wrong side of the margin
  - if $\epsilon_i>1$ then the ith observation is on the wrong side of the hyperplane

C is a nonnegative _tuning (or regularization) parameter_ that is chosen via _Cross-Validation_

- C _bounds the sum_ of the $\epsilon_i$ ,
- and so it _determines the number of severity of the violations_ to the margin (and hyperplane)
  - C is considered as a **Budget** for the amount that the margin can be violated by the n observations
  - if C = 0, _NO Budget_ for violations to the margin, all $\epsilon_i = 0$
  - if C > 0, _no more than C_ observations can be on the wrong side of the hyperplane
    - since $\epsilon_i>1$ and $\sum_{i=1}^n\epsilon_i \leq C$
  - As C increases, _more tolerant of violations_ to the margin
    - the margin will _widen_ so _fit the data less hard_
    - **Low Variance but More Bias**
      - since many observations are support vectors that determine the hyperplane
  - As C decreases, the margin narrows so is rarely violated
    - this amounts to a classifiers that is _highly fit_ to the data
    - **Low Bias but High Variance**
      - fewer support vectors

{{< figure src="/images/ISLR/figure9-7.jpg">}}

**Property：**

ONLY observations that _either lie on_ the margin _or violate_ the margin will affect hyperplane and hence the classifier obtained.

- those observations are known as **Support Vectors** and do affect Support Vector Classifier
- an observation that _lies strictly on the correct side_ of the margin does NOT affect the Support Vector Classifier

SVC's _decision rule_ is based ONLY on the _support vectors_ (a small subset of the training observations）

- it is quite _Robust_ to the behavior of observations that are _far away_ from the hyperplane
- vs LDA （different): classification rule depends on _the mean of ALL of the observations_ within each class
  - as well as the within-class _covariance matrix_ computed using ALL of the observations
- vs Logistic（closely related): _low sensitivity_ to observations far from the decision boundary.
- A detailed comparison of Classification Methods will be seen in next note！

### 2.3 Support Vector Machines

#### Classification with Non-Linear Decision Boundaries

Support Vector Classifiers are _useless_ if the boundary between the two classes is _Non-Linear_.

{{< figure src="/images/ISLR/figure9-8.jpg">}}

TO address non-linear boundaries problem, we could **enlarging the feature space** using quadratic, cubic and even higher-order polynomial functions of the predictors

- rather than fitting a SVC using p features: $X_1,X_2,\cdots,X_p$
- we could instead fit a SVC using 2p features:
  $$X_1,X_1^2,X_2,X_2^2\cdots,X_p,X_p^2$$

#### Solve Optimization Problem

$$\max_{\beta_0,\beta_{11},\beta_{12}, \cdots,\beta_{p1}, \beta_{p2}, \ \epsilon_1,\cdots,\epsilon_n,\ M} M$$
$$s.t. \ y_i(\beta_0 + \sum_{j=1}^p\beta_{j1}x_{ij} + \sum_{j=1}^p\beta_{j2}x_{ij}^2)\geq M(1-\epsilon_i),$$
$$\epsilon_i \geq 0, \ \sum_{i=1}^n\epsilon_i \leq C, \sum_{j=1}^p \sum_{k=1}^2 \beta_{jk}^2 = 1,$$

This leads to a _non-linear_ decision boundary because:

- In the enlarged feature space, the decision boundary is in fact _Linear_
- In the original feature space, the decision boundary is of the form q(x) = 0, where q is a quadratic polynomial
  - and its solutions a generally _Non-Linear_
- Con: polynomials are wild but inefficient to enlarge feature space
  - unmanageable computations

#### Using Kernels to Enlarge Feature Space

A kernel is a function that quantifies the similarity of two observations

- more elegant and controlled way to introduce _nonlinearities_ and efficient computations in SVC

**Linear Kernel**:  
$K(x_i,x_{i'}) = \sum_{j=1}^p x_{ij}x_{i'j} = <x_i, x_{i'}>$ --- (inner product between two vectors)

The Linear SVC can be represented as
$$f(x) = \beta_0 + \sum^n_{i=1}\alpha_i <x,xi>  \ \ -- \text{n parameters}$$
**Polynomial Kernel**  
$$K(x_i,x_{i'}) = (1 + \sum_{j=1})$$

**Radial Kernel**

$$K(x_i,x_{i'}) = exp(-\gamma \sum_{j=1}^p(x_{ij}-x_{i'j})^2)$$

**Advantages of Kernels**

- Efficient Computations
  - ONLY compute $K(x*i,x*{i'}) $ for all n(n-1)/2 distinct pairs i, i'.
    - this can be done

