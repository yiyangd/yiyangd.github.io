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

### Week 5. Working with Dates （2021-10-14）

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

#### Example 20: Extract the date

There are SAS fuctions to extract the day of the week, day of the month, month, and year from a SAS date.

{{< figure src="/images/sas/date_functions.jpg" width="600">}}

```sas
data extract;
  set four_dates;
  Day = weekday(DOB); /* Sunday: 1, Monday: 2 */
  DayofMonth = day(DOB); /*1-31*/
  Month = month(DOB); /*1-12*/
  Year = year(DOB); /* xxxx */
run;

proc print data = extract noobs;
  var DOB Day -- Year; /* Include all of the variables from Day through Year in the order they are stored in the SAS dataset*/
run;
```

#### Example 21: Create a SAS date

- Use `mdy()`

```sas
data mdy;
  input Month Day Year;
  Date = mdy(Monty, Day, Year);
  format Date mmddyy10.;

datalines;
10 21 1950
1 15 5
3 . 2005
5 7 2000
;
run;
```

For Missing date

- `missing()`

```sas
data substitute;
  set mdy;
  if missing(Day) then Date = mdy(Month,15,Year);
  else Date = mdy(Month,Day,Year);
  format Date worddate.;
run;
```

#### Example 22: Compute Date Intervals

**INTCK**: computes the `number` of intervals between two dates

- `INTCK('interval', from, to)`

```sas
/* _NULL_ dataset is used to execute Data Step without observations*/
data _null_;
  days = intck('day', today(), '25dec2021'd); /* How many days till Chrismas Day. */
  put days; /* Write to the SAS log. i.e. results will be displayed in SAS log. */
run;
```

**INTNX**: computes a `date` after a given number of intervals

- `INTNX('interval', from, to)`

```sas
data _null_;
  date = intnx('month', '24dec2017'd, 2, 'sameday');
  format date date9.;
  put date;
run;
```

#### Example 23: US Presidential Inaugurations and deaths

```sas
data year_days;
input @1 Date anydtdte11. /* Informats that is a alternative to other formats such as DATEw. , MMDDYYw. and YYMMDDw. */
      @13 Event $28.;

Prev_date = lag(Date); /* Shift downward Date by one row as a new column */
Years = intck('year', Prev_date, Date, 'continues'); /* number of completed years */
Anniv = intnx('year', Prev_date, Years, 'sameday');

Days = intck('day', Anniv, Date);

Anniv_v2 = put(Anniv, ddmmyy10.); /* Convert variable type*/

format Date Prev_date Anniv Date9.;

datalines;
Apr 30,1789 Washington Inaug
Mar 4, 1797 J Adams Inaug
Dec 14,1799 Washington Death
Mar 4, 1801 Jefferson Inaug
Mar 4, 1909 Madison Inaug
Mar 4, 1917 Moroe Inaug
Mar 4, 1825 JQ Adams Inaug
Jul 4, 1826 Jefferson Death
Jul 4, 1826 J Adams Death;
run;

/* PDF Output */
ods pdf file="...\intck_intnk_out.pdf";
proc print data = year_days;
var Event Date Prev_date -- Anniv_v2;
run;

ods pdf close;
```

{{< figure src="/images/sas/pdf_output.jpg" width="600">}}

