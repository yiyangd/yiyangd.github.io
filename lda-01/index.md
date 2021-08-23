# LDA 1 - Linear Discriminant Analysis 


### 0. LDA vs Logistic Regression

-

1. When the classes are _well-separated_, the _parameter estimates_ for the logistic regression model are _surprisingly unstable_

- LDA is more stable

2. If n is small and distribution X ~ Normal in each of the classes,

- LDA is more accurate than Logistic Regression

3. LDA is more common when we have more than two response classes ($K \geq 2 $ )

### 1. Bayes' Theorem for Classification

Let $\pi_k$ represent the overall or _prior probability_ that a randomly chosen observation comes from the _kth_ class;

Let $f_k(x)=\Pr(X=x\ |\ Y=k)$ denote the _density function_ of X for an observation that comes from the _kth_ class.

**Bayes' Theorem:**
$$\Pr(Y=k\ |\ X=x)=\frac{\pi_kf_k(x)}{\sum_{l=1}^K\pi_lf_l(x)}$$

Recall that the Bayes Classifier classifies an observation to the class for which $p_k(X)$ is largest,

### 2. LDA for p=1

$\delta—$

