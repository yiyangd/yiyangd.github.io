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

### 2. Python Practice

Step1: Import the library and read the file

- Create a copy of original data in case we erase certain values and read the csv file again
- `df.head()` shows the information of the top five observations for the data set

```python
import pandas as pd
import numpy as np

raw_csv_data = pd.read_csv("Index2018.csv")
df_comp = raw_csv_data.copy()

df_comp.head()
```

Output:
{{< figure src="/images/financial-time-series/df_head.jpg">}}

- `date`: represents the day when the values of the other columns (closing prices of four market indexes) were recorded
- Each market index is a portfolio of the most traded companies on the respective stock exchange markets:
- `spx`: S&P 500 measures the stability of the US stock exchanges
- `dax`: DAX 30 measures the stability of the German stock exchanges
- `ftse`: FTSE 100 measures the stability of the London Stock exchanges
- `nikkei`: NIKKEI 225 measures the stability of the Japanese stock exchanges

Step2: Visualize the data

