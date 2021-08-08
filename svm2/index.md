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

$\epsilon_i$ is *slack variable* that allows individual observation to be on the *wrong side* of the margin or the hyperplane
- it tells us where the ith observation is located, relative to the hyperplane and relative to the margin
    - if $\epsilon_i=0$ then the ith observation is on the correct side of the margin
    - if $\epsilon_i>0$ then the ith observation is on the wrong side of the margin
    - if $\epsilon_i>1$ then the ith observation is on the wrong side of the hyperplane

C is a nonnegative *tuning parameter* that is chosen via *Cross-Validation*
- C *bounds the sum* of the $\epsilon_i$ , 
- and so it *determines the number of severity of the violations* to the margin (and hyperplane)
    - C is considered as a *budget* for the amount that the margin can be violated by the n observations
    - if C = 0, *NO Budget* for violations to the margin, all $\epsilon_i = 0$
    - if C > 0, *no more than C* observations can be on the wrong side of the hyperplane
        - since $\epsilon_i>1$ and  $\sum_{i=1}^n\epsilon_i \leq C$
    - As C increases, *more tolerant of violations* to the margin
        - the margin will *widen* so *fit the data less hard*
        - **Low Variance but More Bias**
            - since many observations are support vectors that determine the hyperplane
    - As C decreases, the margin narrows so is rarely violated
        - this amounts to a classifiers that is *highly fit* to the data
        - **Low Bias but High Variance**
            - fewer support vectors

{{< figure src="/images/ISLR/figure9-7.jpg">}}


**Property：**  

ONLY observations that *either lie on* the margin *or violate* the margin will affect hyperplane and hence the classifier obtained.
- those observations are known as **Support Vectors** and do affect Support Vector Classifier
- an observation that *lies strictly on the correct side* of the margin does NOT affect the Support Vector Classifier


SVC's *decision rule* is based ONLY on the *support vectors* （a small subset of the training observations）
- it is quite *Robust* to the behavior of observations that are *far away* from the hyperplane
- vs LDA （different): classification rule depends on *the mean of ALL of the observations* within each class
    - as well as the within-class *covariance matrix* computed using ALL of the observations
- vs Logistic（closely related): *low sensitivity* to observations far from the decision boundary.
- A detailed comparison of Classification Methods will be seen in next note！

### 2.3 Support Vector Machines
#### Classification with Non-Linear Decision Boundaries
Support Vector Classifiers are *useless* if the boundary between the two classes is *Non-Linear*.

{{< figure src="/images/ISLR/figure9-8.jpg">}}

TO address non-linear boundaries problem, we could **enlarging the feature space** using quadratic, cubic and even higher-order polynomial functions of the predictors
- rather than fitting a SVC using p features: $X_1,X_2,\cdots,X_p$
- we could instead fit a SVC using 2p features:
$$X_1,X_1^2,X_2,X_2^2\cdots,X_p,X_p^2$$

#### Solve Optimization Problem
$$\max_{\beta_0,\beta_{11},\beta_{12}, \cdots,\beta_{p1}, \beta_{p2}, \ \epsilon_1,\cdots,\epsilon_n,\ M} M$$
$$s.t. y_i(\beta_0 + \sum_{j=1}^p\beta_{j1}x_{ij} + \sum_{j=1}^p\beta_{j2}x_{ij}^2)\geq M(1-\epsilon_i),$$
$$\epsilon_i \geq 0, \ \sum_{i=1}^n\epsilon_i \leq C, \sum_{j=1}^p \sum_{k=1}^2 \beta_{jk}^2 = 1,$$


#### Using Kernels to Enlarge Feature Space
SVM = SVC + Kernels


