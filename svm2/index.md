# Svm2


### SVM 2. Support Vector Classifiers

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
- C is a nonnegative *tuning parameter*
- $\epsilon_i$ are *slack variables* that allow individual observations to be on the *wrong side* of the margin or the hyperplane


