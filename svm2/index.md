# Statistical Learning Notes | SVM 2 - Support Vector Classifiers and Machines


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

### 2.3. Support Vector Machines

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
$$K(x_i,x_{i'}) = \sum_{j=1}^p x_{ij}x_{i'j} = <x_i, x_{i'}> \- \- \text{inner product between two vectors}$$

- The Linear Kernel quantifies the similarity of a pair of observations _using Pearson(standard) Correlation_

The Linear SVC can be represented as
$$f(x) = \beta_0 + \sum^n_{i=1}\alpha_i <x,x_i>  \- \- \text{n parameters}$$

- To _Estimate the Parameters_ $\beta_0, \alpha_0, \cdots, \alpha_n$, we need ALL
  - $\binom{n}{2}$ inner products $<x_i, x_{i'}>$ between ALL pairs of n training observations
- Solution: $\alpha_i > 0$ ONLY for the _Support Vectors_
  - and the other $\alpha_i = 0$ if a training observation is NOT a support vector
- Summary: to represent the linear classifier f(x), and to _compute its coefficient_ - all we need are _inner products_

**Polynomial Kernel**:  
$$K(x_i,x_{i'}) = (1 + \sum_{j=1}^p x_{ij}x_{i'j})^d$$

- using such a kernel with _degree d > 1_ leads to a MUCH MORE **flexible decision boundary**
- when SVC is combined with a _Non-Linear Kernel_,
  - the resulting classifier is known as **Support Vector Machine**

To compute the inner-products needed for _d dimensional polynomials_

- $\binom{p+d}{d}$ basis functions, we get the non-linear function with the form:
  $$f(x) = \beta_0 + \sum_{i \in S}\alpha_i K(x,x_i)$$
- S is the _collection of indices of Support Vectors_

{{< figure src="/images/ISLR/figure9-9.jpg">}}

**Radial Kernel**  
$$K(x_i,x_{i'}) = exp(-\gamma \sum_{j=1}^p(x_{ij}-x_{i'j})^2)$$

- part of Multivariate Gaussian Distribution
- the feature space is _infinite-dimensional and implicit_
  - because Taylor Series Expansion for $e^{x_1,x_2}$ can be represented by infinite inner product
  - when fitting the data, many of the dimensions are squashed down heavily
- _smaller_ $\gamma$ => lower variance, higher biase=> smoother(simpler) decision boundaries
  - because Larger RBF kernel bandwidths produce smoother feature space mappings
- _larger_ $\gamma$ => higher variance => more flexible(complex) decision boundaries (less smooth)
  - fit becomes _more non-linear_
  - lower training error rates but higher testing error rates - overfit!
    {{< figure src="/images/ISLR/RBF-Gamma.png">}}

If a given test observation $x = (x_1,\ldots,x_p)^T$ is _far_ from a training observation $x_i$ in terms of _Euclidean Distance_,

- then $\sum_{j=1}^p(x_j-x_{ij})^2$ will be _large_
- and so $K(x,x_{i}) = exp(-\gamma \sum_{j=1}^p(x_j-x_{ij})^2)$ will be _tiny_
- recall that the _predicted class label_ for the test observation $x$ is _based on the sign_ of f(x)
  - _far_ training observations _do not have an effect_ on the test observation x

Radial Kernel has very _Local Behavior_, ONLY Nearby training observations have an effect on how we classify a new test observation

#### Advantage of Kernels

Efficient Computations ONLY compute $K(x_i,x_{i'})$ for all n(n-1)/2 distinct pairs $x_i, x_i'$.

- this can be done WITHOUT explicitly working in the enlarged feature space, which may be so large that computations are intractable

