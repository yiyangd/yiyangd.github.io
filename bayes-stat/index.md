# 

## 4. Likelihoods

$$p(data|\theta)$$

### 4.1. What is a Likelihood

Imagine that we flip a coin and record its outcome. The simplest(idealised) model to represent this outcome ignores:

- the angle the coin was thrown at
- its height above the surface
- etc..

Because of our ignorance, our model cannot perfectly predict the behaviour of the coin.

- this uncertainty means that our model is **probabilistic** rather than **deterministic**

For

We can use our model to calculate the probability of obtaining two heads in a row:
$$Pr(H,H|\theta, Model) = Pr(H|\theta,Model) \times Pr(H|\theta, Model)$$
$$=\theta \times \theta = \theta^2 = (\frac{1}{2})^2 = \frac{1}{4}$$

