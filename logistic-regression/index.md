# Statistical Learning Notes | Logistic Regression, Cost Function, Gradient Descent


Recall: Logistic Regression is an Algorithm for Binary Classification

An image is store in the computer in **three separate matrices**

- corresponding to the _Red, Green, and Blue color channels_ of the image.
- The three matrices have the same size as the image, for example, the resolution of the cat image is (64 pixels X 64 pixels), the three matrices (RGB) are 64 X 64 each.

#### Set up

Given $X \in \R^{n_x}$, we want $\hat{y} = P(y=1|x), \hat{y} \in [0,1]$

- Parameters: $w \in \R^{n_x}

