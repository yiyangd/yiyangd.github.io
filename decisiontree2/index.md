# Statistical Learning Notes | Decision Tree 2 - Bagging & Random Forrest & Boosting


1.Bagging  
-- Out-of-Bag (OOB) Error Estimation  
-- Variable Importance Measures  
2.Random Forest  
-- Decorrelating the Trees  
3.boosting  
-- Algorithm  
-- Three Tuning Parameters

These three ensemble methods use trees as building blocks to construct more powerful prediction models

### 1. Bagging

Bootstrap is used when it is hard or even impossible to directly compute the Standard Deviation.

Bootstrap Aggregation (or bagging) can reduce the _high-variance_ of decision trees

- high variance may result in fitting quite different trees on different part of same data

A set of $\{X_1,...,X_n\}\ $ with variance $\sigma^2$  
_Averaging a set of observations $\bar{X}\ $ reduces variance to $\sigma^2/n \ $_

To reduce the variance of a model and improve the prediction accuracy

- Using B separate training sets from the population (hard since data may not enough)
- Fit separate model $\hat{f}^1(x),...,\hat{f}^B(x)$
- _Average_ them to obtain a _low-variance_ model:

$\hat{f}_{avg} (x)= \frac{1}{B} \sum_{b=1}^B \hat{f}^b(x)$

_Bagging(Bootstrap)_ takes repeated samples from _single trainging data set_

- Generate B different bootstrapped training data sets
- then train the model on $b^{th}$ bootstrapped training set to get $\hat{f}^{*b}(x)$
- _Average_ all the predictions:

$$\hat{f}_{bag}(x)=\frac{1}{B}\sum_{b=1}^B\hat{f}^{*b}(x)$$

**Bagging for Regression Tree:**  
Construct B regression trees using B bootstrapped training sets, these trees are grown deep and unpruned

- each individual tree has high variance and low bias
- Average these B trees to reduce the variance and improve accuracy

**Bagging for Classification Tree:**  
Record the class predicted by each of the B trees, and take a _majority vote_:

- The overall prediction is the _most commonly occuring class_ among the B predictions.

**Heart Disease Example:**

{{< figure src="/images/ISLR/figure8-8.jpg">}}

The number of trees B is not a critical parameter with bagging, large B will not lead to overfitting.

#### Out-of-Bag (OOB) Error Estimation

On average, each bagged tree makes use of around two-thirds of the observations,

- the remaining one-third of the observations not used to fit a given bagged tree are referred to as the out-of-bag (OOB) observations

For the $i\,^{th}$ observation, there will be around B/3 predictions to average or take a majority vote.

The resulting OOB error is a valid estimate of the test error for the bagged model

- since the response for each observation is predicted using ONLY the trees that were NOT fit using that obseration

**OOB replaces CV:**  
The OOB approach for estimating the Test Error is better when performing bagging _on large data sets_ for which CV would be _computationally onerous_

- as B sufficiently large, OOB error is virtually equivalent to LOOCV error

#### Variable Importance Measures

Bagging _improves accuracy_ at the expense of _interpretability_

- not clear which variables are important

Still can obtain an _overall summary_ of the importance of each predictor by

- Record the total amount that the _RSS_ is decreased due to splits over given predictor for bagging regression trees
- Add up the total amount that the _Gini Index_ is decreased due to splits over given predictor for bagging classification trees
- Average over all B trees and a large value indicates an important predictor

{{< figure src="/images/ISLR/figure8-9.jpg">}}

### 2. Random Forest

Random Forests provide an improvement over _bagged trees_ by a way of a small _tweak_ that _decorrlates_ the trees.

As in bagging, RF builds a number of trees on bootstrapped training samples,

- _a random sample of m predictors_ is chosen as split candidates from _all p predictors_
- a fresh _resample of m predictors_ at each split and use ONE of those _m predictors_
- $m\approx\sqrt{p}$

#### RF vs Bagging

The prediction from the bagged trees is _highly correlated_,

- since most trees will use the strongest predictor in the top split
- all of the bagged trees look quite similar

#### Decorrelating the Trees

RFs force each split to consider ONLY a subset of the predictors

- on average (p-m)/p of the splits will NOT consider the strongest predictor
- other predictors will have more of a chance to be considered at first
- this makes the average of the resulting trees _less variable and more reliable_
- and _reduction_ in test error and OOB error

Small m will be helpful if a large number of correlated predictors

- Example: RF on high-dimensional biology data includes 500 genes that have the largest variance in the training set

{{< figure src="/images/ISLR/figure8-10.jpg">}}

### 3. Boosting

Boosting does not involve bootstrap sampling

- instead each tree is grown _sequentially_ using information from _previously_ grown trees
- on a modified version of the original data set

#### Boosting for Regression Trees:

1. Set $\hat{f}(x)=0\ $ and $r_i=y_i \ $ for all i in the training set.
2. For b = 1,2,...,B, repeat:  
   (a) Fit a tree $\hat{f}^b$ with d splits (d+1 leaves) to the training data (X,r)  
   (b) Update $\hat{f}\ $ by adding in a *shrunken version* of the new tree:   $$\hat{f}(x) \leftarrow \hat{f}(x)+\lambda\hat{f}^b(x)$$
(c) Update the Residuals:  $$r_i \leftarrow r_i - \lambda\hat{f}^b(x_i)$$
3. Output the Boosted Model:
   $$\hat{f}(x)=\sum_{b=1}^B\lambda\hat{f}^b(x)$$

#### Explanation:

Fit a tree using the _current residuals_ rather than Y

- then add this new tree into the fitted function to _update the residuals_

Splits Parameter d controls each tree to be _small with a few leaves_

- by fitting _small trees to the residuals_, we _slowly improve_ $\hat{f}$
- in areas where it does NOT perform well

The shrinkage parameter $\lambda\ $ _slows the process down_ even further

- allows more and different trees to _attack the residuals_

#### Idea:

The Boosting _learns slowly_

- Unlike fitting a single large decision tree to the data, which amounts to _fitting the data hard_ and potentially _overfitting_
- Unlike in bagging, the construction of each tree _depends strongly_ on the trees that have already been grown
- In general, Statistical Learning methods that _learn slowly_ tend to _perform well_

#### Three Tuning Parameters:

1.**The number of trees B**.

- Large B leads to overfit for boosting, unlike bagging and RFs
- Use CV to select B

  2.**The shrinkage parameter $\lambda$**

- $\lambda$ = 0.01 or 0.01 typically _controls the boosting learning rate_
- a very _small $\lambda\ $_ can require using a very _large B_ to _perform well_

  3.**The number d of splits in each tree**

- _controls the complexity_ of the _boosted ensemble_
- $d=1$ works well, in which case each tree is _stump_ with single split
- the boosted ensemble is fitting an _additive model_, since each term involves ONLY a single variable
- d is the _interaction depth_ that controls the _interaction order_ of the _boosted model_, since d splits can involve at most d variables

**Boosting vs RF**  
{{< figure src="/images/ISLR/figure8-11.jpg">}}

In boosting, since the growth of a particular tree _takes into account the other_ trees that have already been grown, smaller trees are typically sufficient

- using smaller trees can aid in _interpretability_
- e.g. using _stumps_ leads to _an additive model_

