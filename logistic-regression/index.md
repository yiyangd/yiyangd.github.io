# Statistical Learning Notes | Logistic Regression, Cost Function, Gradient Descent


Recall: Logistic Regression is an Algorithm for Binary Classification

An image is store in the computer in **three separate matrices**

- corresponding to the _Red, Green, and Blue color channels_ of the image.
- The three matrices have the same size as the image, for example, the resolution of the cat image is (64 pixels X 64 pixels), the three matrices (RGB) are 64 X 64 each.

{{< figure src="/images/deeplearning/log1.jpeg" width="600">}}

#### Set up

Given $X \in \R^{n_x}$, we want $\hat{y} = P(y=1|x), \hat{y} \in [0,1]$

- Parameters: $w \in \R^{n_x}, b \in \R$
- Let $z = w^T x + b$
- Output:

$$\hat{y} = \sigma (z) = \frac{1}{1+e^z}$$

- if z positive infinity: $\sigma (z) \approx \frac{1}{1+0} = 1$
- if z negative infinity: $\sigma (z) \approx \frac{1}{1+\infty} = 0 $

#### Cost Function for Logistic Regression

Given m training data: {$(x^{(1)},y^{(1)}), \dots, (x^{(m)},y^{(m)})$}

- Goal: Let Machine Learning train the parameters w and b to **minimize the Loss(Error) Function**:

$$L(\hat{y}, y) = - (y \log(\hat{y}) + (1-y) \log(1-\hat{y}))$$

- if $y = 1$, $L(\hat{y}, y) = - \log(\hat{y})$, to make L as small as possible, let $\hat{y} \approx 1$
- if $y = 0$, $L(\hat{y}, y) = - \log(1-\hat{y})$, to make L as small as possible, let $\hat{y} \approx 0$

**Cost Function**
$$J(w,b)=\frac{1}{m}\sum^m_{i=1} L(\hat{y}^{(i)}, y^{(i)})$$
$$=\frac{1}{m}\sum^m_{i=1} [-y^{(i)}\log (\hat{y}^{(i)}) - (1-y^{(i)})\log (1-\hat{y}^{(i)})]$$

