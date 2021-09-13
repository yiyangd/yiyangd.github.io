# Financial Time Series Analysis 


### 1. Introduction to Time Series in Python

Time Series is a **sequence** of information which attaches a _time period_ to each value

- A common topic in Time Series Analysis is determining the **stability** of financial markets and the efficiency protfolios (效率投资组合)

#### Properties

All time-periods must be **equal and clearly defined**, which would result in a _constant frequency_

- Frequency: how often values of the data set are recorded
- if the intervals are not identical => dealing with missing data

**Time-Dependency(时效性)**: the values for every period are affected by outside factors and by the values of past periods

- in chronological order
- from a machine learning perspective, this is inconvenient for train/test data split
  - we need pick a cut-off point and let the period before the cut-off point be the training set and the period after the cutoff point be the testing set

#### Code

