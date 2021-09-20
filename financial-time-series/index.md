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

**Step1**: Import the library and read the file

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
{{< figure src="/images/financial-time-series/df_head.jpg" width="200">}}

- `date`: represents the day when the values of the other columns (closing prices of four market indexes) were recorded
- Each market index is a portfolio of the most traded companies on the respective stock exchange markets:
- `spx`: S&P 500 measures the stability of the US stock exchanges
- `dax`: DAX 30 measures the stability of the German stock exchanges
- `ftse`: FTSE 100 measures the stability of the London Stock exchanges
- `nikkei`: NIKKEI 225 measures the stability of the Japanese stock exchanges

**Step2**: Transform "dd/mm/yyyy" format to "yyyy-mm-dd" `datetime` format

- set `date` as index: `inplace = True` lets date replace the integer index
  - Once "date" becomes an index, we no longer save/modify its values as a seperate attribute in the data frame
- set frequency:
  - arguments: 'h' - hourly, 'w' - weekly, 'd' - daily, 'm' - monthly
  - not interested in any weekends or holidays => missing values NaN
  - 'b' - business days

```python
df_comp.date = pd.to_datetime(df_comp.date, dayfirst = True)
df_comp.set_index("date", inplace = True)
df_comp = df_comp.asfreq('b')
df_comp.head()
```

Output:
{{< figure src="/images/financial-time-series/date_index_head.jpg" width="200">}}

**Step3**: Handling Missing Values

- For each attribute, `df_comp.isna().sum()` will show the number of instances without available information for each column
- Setting the frequency to "business days" must have generated 8 dates, for which we have no data available
- `fillna()` method:
  - front filling: assigns the value of the previous period
  - back filling: assigns the value for the next period
  - assigning the same average to all the missing values (bad approach)

