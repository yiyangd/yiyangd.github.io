# Course Notes | SFU STAT342 - SAS 


SAS: Statistical Analysis System

#### Variables in SAS

SAS has only two types of variables: `character` and `numeric`

Tips:

- Use `$` after the `character` variable
- Use `.` to replace the missing values
- Case **IN**sensitive

Invalid Names:

- 1_begins_with_a_number
- contains blanks
- contains-invalid-characters%

#### Example 1: Basic Steps in SAS programs

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

proc print data = studgrade;
/* proc step: perform any analysis and  print the dataset. Here we are only printing the dataset*/
run;


/* View discriptor portion of the dataset 'Studgrade'.*/

/*proc contents data = Studgrade;
run;*/
```

{{< figure src="/images/sas/proc_content.jpg" width="600">}}

### Week 2: Input Styles (2021-9-16)

`infile` statement reads the data stored in an external file

- must execute before the `input` statement

Four ways to describe values of a dataset in the input statement

#### Example 2: Infile & List Input

- raw data is _separated by at least one spaces_
- all missing data must be indicated by `.`
- `$` should be after the character variable

```sas
data Students;
    infile "...path/data.txt";
    input Major $ Age Height Weight;
run;
```

#### Example 3: Column Input

Column Input can be used when data file _does not have spaces_ between values but in fixed columms

- missing data left blank

```sas
data Students;
    infile "...path/column_data.txt";
    input Major $ 1-4 Age 5-6 Height 7-9 Weight 10-12;
run;
```

#### Example 4: Print Specific Variables with title without observation column

- `noobs`
- `var`
- `title`: global variables

```sas
title 'Data Table';

proc print data = Student noobs;
  var Name Height Weight;
run;
```

#### Example 5: Formatted Input using column pointer

`@n` pointer moves the input pointer to specific column `n`  
`+n` moves the pointer forward n columns that is relative to the current position

```sas
data student;
  input @6 name $11. /* start with col1 an read next 4 cols */
        @27 height 2.
        +5 DOB mmddyy8.
        +1 calorie comma5.;
datalines;
1302 Benedictine Arnold 2 68 190 11/30/95 2,432
;
run;
```

#### Example 6: Named Input with "="

```sas
data info;
  input @1 id 4.
        @9 name = $ 6. /* Once the input start to read with Named Input, all remaining values must be read with Named Input */
        @6 height = 2.;
datalines;
1024 height=65 name=Smith
/* index
12345|xxxxx|678|xxx|90123
*/
```

#### Example 7: Show the Frequency Table

- `proc freq`
- `tables`

```sas
title 'Frequencies by Major`;
proc freq data = Students;
     tables Major;
run;
```

#### Example 8: Computes the mean, std, min/max of variables

- `proc means`

```sas
title 'Summary Statistics'
proc means data = Students;
  var Age Weight Height;
run;
```

#### Example 9: Compute and Add a new variable

```sas
data Students;
  infle ".../student_data.txt";
  input Height Weight;
  BMI = Weight/(Height/100)**2;
run;
```

### Week 3 - 4. Reading data from external files

#### Example 10: Read Data from .csv files

`dsd` option performs serveral functions:

- changes the default delimiter from a blank to comma,
- treats two-co,,a in a row (, ,) as missing value
- strips "quotes" from the character values

```sas
filename CSVfile '...path/data.csv'; /*alias*/

data CSVimport;
  infile CSVfile dsd;
  input Name $ Age Height Weight;
run;
```

#### Example 11: Read Data from other delimiters

`'09'x` represents the TAB in hexadecimal value

```sas
data other_dlm;
infile '.../other_dlm.txt' dlm=':';
/* infile '.../other_dlm.txt' dlm='09'x; */
input Age Height;
run;
```

#### Example 12: Reading data values by specifying infile options with the datalines statement

```sas
data dsd_datalines;
  infile datalines dsd;
  /* dsd could drop the "quote" vs "dlm,=','"*/
  input Age Height Weight;
datalines;
"Black" 50, 68, 155
;
```

#### Example 13: Read data using Informats with list input

`Colon :` enables us to use List Input (blank) with an Informat after a variable name

```sas
data informats_list;
  infile ".../.csv" dsd;
  input subj : 1.
      Name : $19.
      DOB  : mmddyy10.
      Salary: dollar8.;
  format DOB date9. Salary dollar8.;
run;
```

Uncommon Case: csv file using blanks instead of commas as delimiter

- `&` modifier is like the colon, let SAS use supplied informat but the delimiter is now ( >= 2) spaces instead of 1.
- Therefore, there should be more than one space between Name and DOB

```sas
input Subj : 1.
      Name & $19.
```

#### Example 14: Read Data using PROC IMPORT

PROC IMPORT Options:

- datafile: file path that we want to import
- out: assign name
- dbms: option to identify the type of file being imported
  - CSV
  - DLM: for delimited file (default is a blank)
  - JMP
  - TAB: tab-delimited values, .txt
  - XLSX: excel file
- replace: overwrite the exisiting file
- getnames: if yes, read the first row of data as variable names

```sas
proc import datafile = "...path/auto.csv"
            out = automob
            dbms = csv replace;
            getnames = yes;
run;
```

#### Example 15: Create a new variable after PROC IMPORT

```sas
data auto;
  set automob; /* Copy all obs from automob dataset*/
  TOT_MILATE = MPG*TANK_VOL; /* Create a new variable column */
run;
```

#### Example 16: Read Data from Excel files

```sas
proc import out = auto1 datafile = "path/auto.xlsx"
            dbms = xlsx replace;
            sheet = "auto"; /* specify which sheet of the excel file should be imported */
            getnames = yes;
run;
```

#### Example 17: Read Data from URL

```sas
/* filename probly TEMP; */
filename probly 'path/download.csv';

proc http
  url='http://.../probly.csv'
  method="GET"
  out=probly;
run;

proc import file = probly out = probly replace dbms = csv;
run;

proc print data = probly;
run;

```

### Week 5. Working with Dates （2021-10-14）

#### Example 18: Read Date from Raw

```sas
data fourdates;
input @1 Subject $3.
      @5 DOB mmddyy10.
      @16 VisitDate mmddyy8.
      @25 TwoDigit mmddyy8.
      @34 LastDate date9.;
format DOB VistDate TwoDigit mmddyy10.
       LastDate date9.;
datalines;
001 10/21/1950 05122003 08/10/65 23Dec2005
002 01/01/1960 11122009 09/13/02 02Jan1960
;
run;
```

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
proc print data = ages noobs;
  var Subject DOB VisitDate Age;
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

### Week 6

#### Example 24: Working with time

SAS `datetime` for _Dec. 06, 1962 at 11:13:04 am_ equals `92488384 seconds` from _Jan. 01, 1960 at midnight_

```sas
/*
 SAS datetime
*/

data _null_;

Time=92488384;
*Time = 1;
format Time datetime.;
put Time; /*06DEC62:11:13:04*/
run;

/************************************************
             SAS time functions
************************************************/

/*
- time() returns the current time as a SAS time value.
- hms(h,m,s) returns a SAS time value for the given hour(h), minutes(m), and seconds(s).
- hour(time) returns the hour portion of a SAS time value(time).
- minute(time) returns the minute portion of a SAS time value(time).
- second(time) returns the second portion of a SAS time value(time).
- (Also, functions intnx( ) and intck( ) that we explored on SAS dates can also be used on SAS times.)
*/

data diet2;
 set diet;

curtime = time(); /*Current time*/
wt_hr = hour(wt_time);
wt_min = minute(wt_time);
wt_sec = second(wt_time);
wt_time2 = hms(wt_hr, wt_min, wt_sec);

format curtime wt_time wt_time2 time8.;


proc print data=diet2;
	title 'The diet data set with five new variables';
    var subj curtime wt_time wt_hr wt_min wt_sec wt_time2;
run;
```

{{< figure src="/images/sas/diet_time.jpg" width="600">}}

#### Example 25: Export SAS code with output in the log to a PDF file

```sas
/*Export SAS code in the log to a PDF file*/
ods pdf file = "Time_ex_code_.pdf";
proc document name = temp;
   /*imports any text file, or a SAS program */
   import textfile = "C:\dropbox\Dropbox\functional\stat342\STAT342 2020\w6 s\Time_ex.sas" to ^ ;
   /*^ refers current directory of the output document*/
   replay; /* we can replay the document whenever we need it and replay only the output items that we are interested in.
             The document can be replayed using the REPLAY statement*/
run;
proc print data=diet2;
	title 'The diet data set with five new variables';
    var subj curtime wt_time wt_hr wt_min wt_sec wt_time2;
run;
quit;
ods pdf close;
/*Note that when you are exporting SAS code to a PDF, always start with a fresh SAS program. Otherwise, it will print
the same SAS code more than one time(depending on the history) in the same document.*/

```

#### Create Permanent SAS datasets

### Week 7

#### 7.1. IF conditions

```sas
data conditional;
 input Age Midterm Quiz $ Final;

*if Age < 20 then AgeGroup = 1;
*if Age lt 20 and Age ne . then AgeGroup = 1;
 if Age lt 20 and not missing(Age) then AgeGroup = 1;
 if Age ge 20 and Age lt 40  then AgeGroup = 2;
 if Age ge 40 and Age lt 60 then AgeGroup = 3;
 if Age ge 60 then AgeGroup = 4;
 datalines;
 21 80 B- 82
 .  90 A  93
 35 87 B+ 85
 48 .  C+ 76
 .  62 F  67
 51 78 C  45
;

 proc print data = conditional noobs;
 run;

/*Better way to write this program - use IF and ELSE IF statements*/

data ifelse;
 set conditional;

 if Age lt 20 and not missing(Age) ;
run;

proc print data = ifelse;
run;

```

#### 7.2. Subsetting IF

```sas
/*Subsetting IF*/

data subset_if;

 input ID Age Midterm Quiz $ Final;

 if Quiz eq 'A'; /*Subset those who got A in Quiz.
                  No THEN following the IF in this program.  */

datalines;
1001 21 80 B- 82
1002 .  90 A  93
1006 35 87 B+ 85
1007 48 .  .  76
1010 .  62 F  67
2010 51 78 C  45
2006 60 90 A  88
;
proc print data = subset_if noobs;
run;
```

#### 7.3. IN Operator

```sas
/*IN Operator*/

data scores;
  input ID Age Midterm Quiz $ Final;
datalines;
1001 21 80 B- 82
1002 .  90 A  93
1006 35 87 B+ 85
1007 48 .  .  76
1010 .  62 F  67
2010 51 78 C  45
2006 60 90 A  88
;
data IN_operator;
 set scores;

 if Quiz in ('A+','A','B+','B') then QuizRange = 1;
 else if Quiz in ('B-','C+','C') then QuizRange = 2;
 else if not missing(Quiz) then QuizRange = 3;

proc print data = IN_operator noobs;
run;

/*IN with WHERE statement*/
/*Subset the data with given ID numbers*/
data where_ex;
 set IN_operator;

 *where ID in (1001,1002,1006);

  where ID in (1001:1010,2006);
  *if ID in (1001:1010,2006);

run;

proc print data = where_ex noobs;
run;

```

{{< figure src="/images/sas/in_operator.jpg" width="600">}}

#### 7.4. SELECT

```sas
/*SELECT statement*/

libname mylib '/home/u59686016/STAT342W07';

data select_statement;
 set mylib.scores;

 select;
  when (missing(Age)) AgeGroup = .;
  when (Age lt 20) AgeGroup = 1;
  when (Age lt 40) AgeGroup = 2;
  when (Age lt 60) AgeGroup = 3;
  when (Age ge 60) AgeGroup = 4;
  otherwise;
 end;
run;

proc print data = select_statement noobs;
run;
```

{{< figure src="/images/sas/select.jpg" width="600">}}

