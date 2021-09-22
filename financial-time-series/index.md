# Note | Financial Time Series Analysis 


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

#### Python Implementation

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
{{< figure src="/images/financial-time-series/df_head.jpg" width="400">}}

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
{{< figure src="/images/financial-time-series/date_index_head.jpg" width="400">}}

**Step3**: Handling Missing Values

- For each attribute, `df_comp.isna().sum()` will show the number of instances without available information for each column
- Setting the frequency to "business days" must have generated 8 dates, for which we have no data available
- `fillna()` method:
  - front filling: assigns the value of the previous period
  - back filling: assigns the value for the next period
  - assigning the same average to all the missing values (bad approach)

```python
df_comp.spx = df_comp.spx.fillna(method = "ffill")
df_comp.ftse = df_comp.ftse.fillna(method = "bfill")
df_comp.dax = df_comp.dax.fillna(value = df_comp.dax.mean())
# to count the missing values
df_comp.isna().sum()
```

**Step4**: Adding and Removing Columns

- just keep the index `time` and `spx` as `market_value`

```python
df_comp['market_value'] = df_comp.spx
del df_comp['spx'], df_comp['dax'], df_comp['ftse'], df_comp['nikkei']
```

**Step5**: Splitting the Time-Series data

- since time series data relies on keeping the chronological order of the values
  - cannot "shuffle" the data before splitting
- `Training Set`: From the beginning up to some cut off point
- `Testing Set`: From the cut off point until the end
- `80-20` split is resonable
  - training set too large: performs poorly with new data
  - training set too small: cannot create an accurate model
- `iloc` comes from `index location`
- `len` comes from `length`
- `int` ensures that the `train_size` will be integer

```python
train_size = int(len(df_comp)*0.8)
df_train, df_test = df_comp.iloc[:train_size], df_comp.iloc[train_size:]
# check if there is overlapping data
df_train.tail()
df_test.head()
```

**Step6**: Data Visualization

```python
import matplotlib.pyplot as plt
df_train.market_value.plot(figsize = (20,5))
plt.title("S&P Prices", size=24)
plt.ylim(0,3000)
plt.show()
```

Output:
{{< figure src="/images/financial-time-series/sp_price_plot.jpg" width="800">}}

**Extra Step**: Scrape the real-time data off of `Yahoo Finance`

```python
import yfinance
import warnings
warnings.filterwarnings("ignore")

# using the .download() method to scrape our data from the Yahoo Finance webpage
raw_data = yfinance.download(tickers = "^GSPC ^FTSE ^N225 ^GDAXI", start = "1994-01-07", end = "2021-09-20", interval = "1d", group_by = "ticker", auto_adjust = True, treads = True)
# tickers => the time series we are interested in
# interval => the distance in time between two recorded observations. Since we're using daily closing prices, we set it equal to "1d", which indicates 1 day.
# group_by => the way we want to group the scraped data. Usually we want it to be "ticker", so that we have all the information about a time series in 1 variable
# auto_adjuest => Automatically adjust the closing prices for each period
# treads => whether to use threads for mass downloading

df_comp = raw_data.copy()

df_comp['market_value'] = df_comp['^GSPC'].Close

del df_comp['^N225']
del df_comp['^GSPC']
del df_comp['^GDAXI']
del df_comp['^FTSE']
df_comp = df_comp.asfreq('b')
df_comp = df_comp.fillna(method='ffill')

train_size = int(len(df_comp)*0.8)
df_train, df_test  = df_comp.iloc[:train_size], df_comp.iloc[train_size:]

```

### 3. White Noise

Definition: A sequence of random data, where every value has a time-period associated with it

- it behaves sporadically, not predictable

Conditions:

- constant mean $\mu$
- constant variance $\sigma^2$
- no autocorrelation in any period: NO clear relationship between past and present values
  - autocorrelation measures how correlated a series is with past versions of itself
  - $\rho = corr(x_t,x_{t-1})$

Generate White Noise data and plot its values

- compare with the graph of the `S&P` closing prices

```python
import matplotlib.pyplot as plt
df_train.wn.plot(figsize = (20,5))
plt.title("white noise time-series", size=24)
plt.show()
```

Output:
{{< figure src="/images/financial-time-series/wn_plot.jpg" width="800">}}

### 4. Random Walk

Definition: A special type of time-series, where values tend to persist over time and the differences between periods are simply **white noise**

- $P_t = P_{t-1} + \epsilon_t$, where the residual $\epsilon_t \sim WN(\mu,\sigma^2)$

The _random walk data_ is much more similar to `S&P prices` than to _white noise values_

- both have small **variations** between consecutive time periods
- both have **cyclical increases and decreases** in short periods of time

```python
rw = pd.read_csv("RandWalk.csv")
rw.date = pd.to_datetime(rw.date, dayfirst = True)
rw.set_index("date", inplace = True)
rw = rw.asfreq('b')
df_train['rw'] = rw.price

df_train.rw.plot(figsize = (20,5))
df_train.market_value.plot()
plt.title("Random Walk vs S&P", size = 24)
plt.show()
```

Output:
{{< figure src="/images/financial-time-series/rw_vs_sp_plot.jpg" width="800">}}

Market Efficiency: measures the level of difficulty in forecasting correct future values

- in general, if a time series resembles a random walk, the prices can't be predicted with great accuracy
- conversely, if future prices can be predicted with great accuracy, then there are **arbitrage opportunities**
  - we can speak of _arbitrage_ when investors manage to buy and sell commodities and make a safe profit while the price adjusts
  - if such opportunities exist within a market, investors are bound to take advantage, which would eventually lead to a price that matches the expected one, as a result, prices adjust accordingly

### 5. Stationarity

#### Strict Stationarity

Rarely observed in nature

- $(x_t,x_{t+k}) \sim Dist(\mu, \sigma^2)$
- $(x_{t+a},x_{t+a+k}) \sim Dist(\mu, \sigma^2)$

#### Weak-form/Covariance Stationarity

Assumptions:

- Constant $\mu$
- Constant $\sigma^2$
- $Cov(x_n,x_{n+k}) = Cov(x_m, x_{m+k})$
  - consistent covariance between periods at an identical distance

**Dickey-Fuller Test**: to check whether a data set comes from a stationary process

- Null Hypothesis: assumes non-stationarity
  - autocorrelation coefficient $\varphi < 1$
- Alternative Hypothesis: $\varphi = 1$
- reject the Null if `test statistic` < `critical value` in the D-F Table
  - stationarity

```python
import statsmodels.graphics.tsaplots as sgt
import statsmodels.tsa.stattools as sts

sts.adfuller(df_train.market_value)

'''
(-0.9614956416665502,        # test statistic is greater than the 1%, 5%, 10% critical values
 0.7670476494835043,         # p-value: there are 76% chance of not rejecting the null (non-stationary process)
 18,                         # there are some autocorrelation going back 18 periods
 5761,                       # number of observations
 {'1%': -3.4314856042568302, # we do not find sufficient evidence of stationary in the data set
  '5%': -2.862041828874895,
  '10%': -2.567037121608915},
 46348.31943803983)          # maximized information criteria provided, lower value => easier to predict the future
'''
# white noise has p-value = 0 => Covariance Stationarity
sts.adfuller(df_train.wn)
'''
(-30.308232415812835,
 0.0,
 6,
 5773,
 {'1%': -3.4314832426913315,
  '5%': -2.8620407854868493,
  '10%': -2.5670365661831696},
 84971.11094405118)
'''

# random walk seems to be a non-stationary process
sts.adfuller(df_train.rw)
'''
(-1.3286073927689719,     # greater than critical values
 0.6159849181617385,
 24,
 4996,
 {'1%': -3.4316595802782865,
  '5%': -2.8621186927706463,
  '10%': -2.567078038881065},
 46299.333497595144)
'''
```

### 6. Seasonality

Trends will appear on a cyclical basis.

**Ways to test for seasonality**:

- Decompose the sequence by splitting the time series into 3 effects:
  - Trend: represents the pattern consistent throughout the data and explains most of the variability of the data
  - Seasonal: expresses all cyclical effects due to seasonality
  - Residual: the difference between true values and predictions for any period

**Naive Decomposition**：
Decomposition function uses the previous period values as a trend-setter.

- Additive: observed = trend + seasonal + residual
- Multiplicative: observed = trend x seasonal x residual

Seasonal looks like a `rectangle`

- values are constantly oscillating back and forth and the figure size is too small
- no concrete cyclical pattern => no seasonality in the data

The residuals vary greatly around 2000 and 2008, this can be explained by the **instability** caused by the `.com` and `housing prices` bubbles respectively

```python
from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.pyplot as plt
season_decomp_additive = seasonal_decompose(df_train.market_value, model = "additive")
season_decomp_additive.plot()
plt.show()
```

Both Output:
{{< figure src="/images/financial-time-series/seasonal_decompose.jpg" width="800">}}

### 7. The Autocorrelation Function (ACF)

Correlation measures the similarity in the change of values of two series

- $\rho(x,y)$ only have a single variable

Autocorrelation is the correlation between a sequence and itself

- measures the _level of resemblance_ between a sequence from several periods ago and the actual data
- `Lagged` is a delayed series of the original one
- how much of yesterday's values resemble today's values, or similarities from year to year

Partial Autocorrelation Function (PACF)

