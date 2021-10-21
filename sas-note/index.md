# Course Notes | SFU STAT342 - SAS 


SAS: Statistical Analysis System

#### Variables in SAS

SAS has only two types of variables: `character` and `numeric`

Tips:

- Use `$` after the `character` variable
- Use `.` to replace the missing values
- Case **IN**sensitive

#### Basic Steps in SAS programs

1. `DATA`: read/write/manipuplate the data and perform calculations

- after `data` step, SAS stores the data in its own special form called a `SAS data set`

2. `PROC`: process SAS datasets in analyzing

- `proc contents` shows the `descriptor` portion of SAS data set
- `proc print` shows the `data` portion in a table

3. `RUN`

```sas
/* Example 1: Read the dataset and print */

data Studgrade; /* data step: assign a name for the dataset and enter the data */
input StudID Midterm Final Grade $; /*Variables in the dataset and enter the data*/
datalines;
101 98 86 A
102 49 60 C
103 98 80 A
104 90 98 A+
105 60 80 B+
106 .  80 C-
;
run;  /*end the data step*/

PROC print data = studgrade; /* proc step: perform any analysis and  print the dataset.
                              Here we are only printing the dataset*/
run;


/* View discriptor portion of the dataset 'Studgrade'.*/

/*proc contents data = Studgrade;
run;*/
```

#### Input Styles

`infile` statement reads the data stored in an external file

- must execute before the `input` statement

Four ways to describe values of a dataset in the input statement

1. List Input

- raw data is _separated by at least one spaces_
- all missing data must be indicated by `.`
- `$` should be after the chacter variable

```sas
data Students;
    infile "...path/data.txt";
    input Major $ Age Height Weight;
run;
```

2. Column Input

- use when data file _does not have spaces_ between values
- missing data left blank

```sas
data Students;
    infile "...path/column_data.txt";
    input Major $ 1-4 Age 5-6 Height 7-9 Weight 10-12;
run;
```

3. Formatted Input

### Week 5. Working with Dates

#### Example 18

#### Example 19: Compute the difference between two dates

- `yrdif()` computes the difference
  - `'Actual'` lets SAS compute the decial number of days between two dates

```sas
data ages;
set fourdates;
Age = yrdif(DOB, visitDate, 'Actual');
/* Age = (visitDate - DOB) / 365 */
run;
title 'Listing of Ages';
proc print data = ages;
  var Subject DOB Age;
  format Age 5.1 /*Value of Age in 5 bytes, with one position to the right of the decimal place*/
run;
```

We can compute the age as an integer

```sas
Age = int(yrdif(DOB, visitDate, 'Actual'));
Age = round(yrdif(DOB, visitDate, 'Actual'));

```

For Constant Date

- one/two-digit day
- three-character month abbreviation
- four-digit year
- single/double quotation followed by `d`

```sas
Age = yrdif(DOB, '01Jan2006'd, 'Actual');
```

For Current Date

- use `today()`

```
CurAge = int(yrdif(DOB, today(), 'Actual'));
```

{{< figure src="/images/sas/date_formats.jpg" width="600">}}

