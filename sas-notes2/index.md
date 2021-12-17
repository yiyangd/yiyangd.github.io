# SAS Notes 02 | Condition, Loop, Merge, Array


### 1. Conditional Statements

#### 1.1. IF conditions

Use `IF` and `ELSE IF` statements, to create the `AgeGroup`

```sas
data conditional;
 input Age Midterm Quiz $ Final;

*if Age < 20 then AgeGroup = 1; /*this will let missing value = 1*/
 if Age lt 20 and Age ne . then AgeGroup = 1;
*if Age lt 20 and not missing(Age) then AgeGroup = 1;
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

/*
Better way to write this program
- use IF and ELSE IF statements
SAS will stop when one condition is satisfied
=> save time
*/
data ifelse;
 set conditional;

 if Age lt 20 and not missing(Age) then AG = 1;
 else if Age >= 20 and Age <= 40 then AG = 2;
 else if Age ge 40 and Age lt 60 then AgeGroup = 3;
 else if Age ge 60 then AgeGroup = 4;
run;

proc print data = ifelse;
run;

```

{{< figure src="/images/sas/if_elseif.jpg" width="300">}}

#### 1.2. Subsetting IF

Subset those who got A in Quiz without `THEN` following the `IF`

```sas
/*Subsetting IF*/

data subset_if;

 input ID Age Midterm Quiz $ Final;

 if Quiz eq 'A';

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

{{< figure src="/images/sas/subsetif.jpg" width="300">}}

#### 1.3. IN Operator with WHERE

```sas
/*IN Operator*/

libname mylib '/home/u59686016/STAT342W07';

data mylib.scores;
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
data in_where;
 set IN_operator;

 *where ID in (1001,1002,1006);

  where ID in (1001:1010,2006);
  *if ID in (1001:1010,2006);

run;

proc print data = in_where noobs;
run;

```

{{< figure src="/images/sas/in_operator.jpg" width="600">}}

#### 1.4. SELECT

`SELECT + WHEN` is same as `IF + ELSE IF`

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

#### 1.5. Logical Operator

```sas
data grades;
   	input name $ 1-15 e1 e2 e3 e4 p1 f1;
	avg = round((e1+e2+e3+e4)/4,0.1);
		 if ((e1 < e3) and (e1 < e4))
            or ((e2 < e3) and (e2 < e4)) then adjavg = avg + 2;
    else adjavg = avg;
datalines;
Alexander Smith  78 82 86 69  97 80
John Simon       88 72 86  . 100 85
Patricia Jones   98 92 92 99  99 93
Jack Benedict    54 63 71 49  82 69
Rene Porter     100 62 88 74  98 92
;
run;

proc print data = grades;
	var name e1 e2 e3 e4 avg adjavg;
run;
```

{{< figure src="/images/sas/logical.jpg" width="400">}}

#### 1.6. WHERE

`WHERE` statement has many `operators` to use

- `IS MISSING` == `IS NULL`
- `BETWEEN AND`
- `CONTAINS`
- `LIKE`
- `=*`

```sas
data where_ex;
   	input name $ 1-15 Age Weight;

datalines;
Alexander Smith  18 82
John Simon       28 72
Patricia Jones   .  92
Jack Benedict    24 63
Nick Porter      40 62
;
run;

proc print data = where_ex noobs;
   *where Age is missing;
   *where Age is null;
   *where Age > 20;
   *where Weight > 60 and Weight < 80;
   *where Name contains 'er';
  * where Name like 'J%';
  /*Names start with the letter J */
   where Name like 'Ja_k%';
   /*Result is Jack with Age = 24 and Weight = 63*/

run;
```

### 2. Loop

#### 2.1. DO Groups

Execute a group of code and stop when a condition is true

- all the statements between `DO` and `END`

```sas
data grades_DO_END;
 input Age Midterm Quiz $ Final_exam;

 if missing(Age) then delete;
 /*
 When the IF condition is true,
 all the statements in the DO group execute.
 */
 if Age <= 39 then do;
    Agegrp = "Younger group";
	  Grade = (0.4 * Midterm) + (0.6 * Final_exam);
 end;
 else if Age > 39 then do;
    Agegrp = "Older group";
	  Grade = (Midterm + Final_exam)/2;
 end;
datalines;
21 80 B- 82
.  90 A  93
35 87 B+ 85
48 .  .  76
59 95 A+ 97
15 88 .  93
67 97 A  91
.  62 F  67
35 77 C- 77
49 59 C  81
;
run;

proc print data = grades_DO_END noobs;
run;

```

{{< figure src="/images/sas/dogroup.jpg" width="400">}}

#### 2.2. Iterative DO Loop

**Example 1:**  
Compute the total amount of money you will have,

- if the you start with $100 and invest it at a 3.75% interest rate for 3 years.
- Numeric index variable

```sas

data DO_loop;
 Interest = 0.0375;
 Total = 100;
 /* Iterative DO statement:
 do index-variable = start to stop by increment
 (default increment = 1);
 */
 do Year = 1 to 3;
    Total = Total + Interest * Total; /*Increment*/
	output;
 end;
 format Total dollar10.2;
run;

proc print data = DO_loop noobs;
run;
```

{{< figure src="/images/sas/doloop1.jpg" width="250">}}

**Example 2:**  
Suppose you want to generate a table of the integers from 1 to 10

- along with their squares and square roots.

```sas
data table;
 *do n = 1 to 10;
 *do n = 0 to 100 by 10;
 do n = 10 to 0 by -2; /*negative increment*/
   Square = n * n;
   SquareRoot = sqrt(n);
   output;
 end;
run;

proc print data = table noobs;
run;
```

{{< figure src="/images/sas/doloop2.jpg" width="300">}}

**Example 3: Graph an equation**

```sas

data equation;
 do x = -10 to 10 by 0.01;
    y = 2*x**3 - 5*x**2 + 15*x -8;
	output; /*Try withput output*/
 end;
run;

title 'Plot of Y versus X';
proc gplot data = equation;
     plot y * x;
run;
quit;
```

{{< figure src="/images/sas/doloop3.jpg" width="300">}}

**Example 4: Character Index Variable**  
`@`: hold the line for another INPUT statement in the DATA step.

- otherwise we need to put each data per line in `datalines`

```sas
data drug;
 do Group = 'Placebo','Active'; /* Character index variable */
    do Subj = 1 to 5;
	   input Score @;
	   output;
	end;
 end;

 datalines;
 250 222 230 210 199 166 183 123 129 234
 ;
 run;

 proc print data = drug;
 run;
```

{{< figure src="/images/sas/doloop4.jpg" width="300">}}

#### 2.3. DO Until

Notes: `DO UNTIL` loop always executes at least once.

```sas

data double_money;
 Interest = 0.0375;
 Total = 100;
 Year = 0;
 do until (Total ge 200);
    Year = Year + 1; *or Year + 1;
	  Total = Total + Total * Interest;
    output;
 end;
 format Total dollar10.2;
run;

proc print data = double_money noobs;
run;

```

{{< figure src="/images/sas/dountil.jpg" width="300">}}

#### 2.4. DO While

`DO WHILE` loop iterates only as the condition following `while` is true.

- loop may not execute

```sas

data double_money;
 Interest = 0.0375;
 Total = 100;
 Year = 0;
 /*executes as long as Total is less than or equal to 200*/
 do while (Total le 200);
    Year = Year + 1; *or Year + 1;
	  Total = Total + Total * Interest;
    output;
 end;
 format Total dollar10.2;
run;

proc print data = double_money noobs;
run;

```

#### 2.5. Leave and Continue

```sas
/*LEAVE and CONTINUE*/

data leave_it;
 Interest = 0.0375;
 Total = 100;
 do Year = 1 to 100;
    Total = Total + Total * Interest;
	  output;
	  if Total ge 150 then leave;
 end;
 format Total dollar10.2;
run;

proc print data = leave_it;
run;


/* CONTINUE */

data continue_on;
 Interest = 0.0375;
 Total = 100;
 do Year = 1 to 100 until (Total ge 200);
    Total = Total + Total * Interest;
	  if Total le 150 then continue;
    output;
 end;
 format Total dollar10.2;
run;

proc print data = continue_on;
run;
```

### 3. Subset

**Example 1:**  
Subset all observations in the dataset Scores where Final > 80

```sas
data final;
 set mylib.scores;
 where Final > 80;
run;

proc print data = final noobs;
run;
```

{{< figure src="/images/sas/subset1.jpg" width="300">}}

**Example 2:**  
Above example shows all the variables.

- if we want to drop `Age` variable from that subset,
- we can use `DROP option` in `SET statement`.
- use `KEEP` option to keep any variables

```sas
data final2;
 set mylib.scores (drop=Age);
 where Final > 80;
run;

proc print data = final2 noobs;
run;
```

{{< figure src="/images/sas/subset2.jpg" width="300">}}

**Example 3:**  
Creating more than one subset data set in one DATA step

- must name every data set following the `OUTPUT` statement.

```sas

data highscorer lowscorer;
 set mylib.scores;
 if Final > 80 then output highscorer;
 else if Final <= 80 then output lowscorer;
run;
title 'High scorers';
proc print data = highscorer noobs;
run;
title 'Low scorers';
proc print data = lowscorer noobs;
run;
```

{{< figure src="/images/sas/subset3.jpg" width="300">}}

### 4. Add Observations (Combine Rows)

**Example 1:**  
Combine Observations from two data sets

- with same or different variables
- `set dataset1 dataset2`
- use `proc sort data = by ID` to sort

```sas
data dataset1;
 input ID Name $ Weight;
datalines;
7 Adams 210
1 Smith 190
2 Schneider 110
4 Gregory 90
;
run;

data dataset2;
 input ID Eyecolor $ Name $;
datalines;
10 Brown Horvath
15 Black Stevens
20 Blue  Nick
;
run;

/*Combine*/

data one_two;
 set dataset1 dataset2;
run;

proc print data = one_two noobs;
run;

proc sort data = one_two;
by ID;
run;
*proc contents data = one_two;
*run;
```

#### Interleave

```sas
data dataset1;
 input ID Name $ Weight;
datalines;
7 Adams 210
1 Smith 190
2 Schneider 110
4 Gregory 90
;
run;

data dataset2;
 input ID Name $ Weight;
datalines;
9 Shea 120
3 O'Brien 180
5 Bessler 207
run;

proc sort data = dataset1;
 by ID;
run;

proc sort data = dataset2;
 by ID;
run;

data interleave;
 set dataset1 dataset2;
 by ID;
 /*Datasets should be sorted according to the [by variable]*/
run;

proc print data = interleave noobs;
run;

*proc contents data = interleave;
*run;
/*
Notice that this output data set is in ID order. There is a minor difference between
obtaining a data set by interleaving and concatenating the data sets and then sorting.
When you use PROC SORT to sort a SAS data set, a sort flag is set (you can see that using PROC CONTENTS)
and SAS does not resort this data set if you attempt to sort it again by the same BY variables.
When you interleave data sets, this sort flag is not set (which should not cause you any problems).
*/

```

### 5. Merge (Combine Columns)

#### Basic Merge

**Example 1:**  
Merge the Employee and Hours data sets as follows:

- Sort each data set by the variable that link the two data sets
- Name each of the data sets in a MERGE statement

Be sure to follow the MERGE statement with a BY statement

- naming the variable that tell SAS which observations to place in the same observation.

```sas
data employee;
 input ID Name $;

datalines;
1 Smith
2 Schneider
4 Gregory
5 Washington
7 Adams
;
run;

data hours;
 input ID Job_class $ Hours;

 datalines;
 1 A 39
 4 B 44
 5 A 35
 9 B 57
 ;
 run;

proc sort data = employee;
  by ID;
run;
proc sort data = hours;
  by ID;
run;

data combine;
 MERGE employee hours;
 by ID;
run;

proc print data = combine noobs;
run;
```

{{< figure src="/images/sas/merge1.jpg" width="300">}}

**Example 2: Handle missing values**

- `in = 1` filters the data with the values
- `file print`: Direct the output produced by the PUT statements to the output.

```sas
data new;
/*Following the keyword IN= is a variable name that you make up.*/
 merge employee (in=InEmploy)
       hours    (in=InHours);
 by ID;
 if InEmploy = 1 and InHours = 1;
 file print;
 put ID= InEmploy= InHours= Name= Job_class= Hours=;
run;

proc print data = new noobs;
run;
```

{{< figure src="/images/sas/merge2.jpg" width="300">}}

**Example 3: Rename ID and Merge**

```sas
proc sort data = bert;
 by ID;
run;

proc sort data = ernie;
 by EmpNo;
run;

data merge2;
 merge bert
       ernie(rename = (EmpNo = ID));
       /*Change the EmpNo to ID*/
 by ID;
run;

proc print data = merge2 noobs;
run;

```

#### Update a Master File from a transaction file

`Update` 2 elements' prices

```sas

data prices;
 input ItemCode 1-3 Description $ 4-19 Price 21-25 ;
datalines;
150 50 foot hose     19.95
175 75 foot hose     29.95
200 greeting card    1.99
204 25lb. grass seed 18.88
208 40lb. fertilizer 17.90
;
run;

data new15dec2005;
 input ItemCode Price;
datalines;
204 17.87
175 25.11
208 .
;
run;

proc sort data = prices;
 by ItemCode;
run;

proc sort data = new15dec2005;
 by ItemCode;
run;

data prices_15dec2005;
 update prices new15dec2005;
 by ItemCode;
run;

proc print data = prices_15dec2005 noobs;
run;

```

### Array

#### Example 1:

The following program simply reads in the average monthly temperature in Celsius
for ten differen cities in the US. We are going to use an array to convert
Celcius to Farenheit.

**Read Data:**

```sas
data avgcelsius;
    input City $ 1-18 jan feb mar apr may jun
                        jul aug sep oct nov dec;
datalines;
State College, PA  -2 -2  2  8 14 19 21 20 16 10  4 -1
Miami, FL          20 20 22 23 26 27 28 28 27 26 23 20
St. Louis, MO      -1  1  6 13 18 23 26 25 21 15  7  1
New Orleans, LA    11 13 16 20 23 27 27 27 26 21 16 12
Madison, WI        -8 -5  0  7 14 19 22 20 16 10  2 -5
Houston, TX        10 12 16 20 23 27 28 28 26 21 16 12
Phoenix, AZ        12 14 16 21 26 31 33 32 30 23 16 12
Seattle, WA         5  6  7 10 13 16 18 18 16 12  8  6
San Francisco, CA  10 12 12 13 14 15 15 16 17 16 14 11
San Diego, CA      13 14 15 16 17 19 21 22 21 19 16 14
;
run;

proc print data = avgcelsius;
    title 'Average Monthly Temperatures in Celsius';
    id City;
    var jan feb mar apr may jun
        jul aug sep oct nov dec;
run;
```

{{< figure src="/images/sas/array1.jpg" width="300">}}

**Convert Celsius temperatures into Farenheit:**

- Define an `array`.
  - array `name`
  - `(12)` is the dimension of the array(how many variables you want to group together).
    - or `(*)`
  - Specify the variable names to be grouped in the array
- Ex: fahr{1} corresponds to the jan.
  - When you use an array like `fahr`, in conjunction with an iterative DO loop,

```sas
data avgfahrenheit;
    set avgcelsius;

    array fahr(12) jan feb mar apr may jun
                   jul aug sep oct nov dec;

    do i = 1 to 12;
            fahr(i) = 1.8*fahr(i) + 32;
    end;
run;

proc print data = avgfahrenheit;
    title 'Average Monthly Temperatures in Fahrenheit';
    id City;
    var jan feb mar apr may jun
        jul aug sep oct nov dec;
run;

```

**Another Way:**  
Note: When specifying a numbered range of variables:

- the variables must have the `same name except for the last numeric character` or characters.
- the variables must be `numbered consecutively`.

```sas
data avgtempsF;
    input City $ 1-18 m1 m2 m3 m4 m5 m6 m7 m8 m9 m10 m11 m12;
    array fahr(*) m1-m12;
    do i = 1 to 12;
            fahr(i) = 1.8*fahr(i) + 32;
    end;
    DATALINES;
State College, PA  -2 -2  2  8 14 19 21 20 16 10  4 -1
;
run;

proc print data = avgtempsF;
    title 'Average Monthly Temperatures in Fahrenheit';
    id City;
    var m1-m12;
run;
```

**Using the special name**

```sas
data avgtempsFtwo;
    input City $ 1-18 jan feb mar apr may jun
                      jul aug sep oct nov dec;

	array fahr(*) _NUMERIC_;
	do i = 1 to 12;
	      fahr(i) = 1.8*fahr(i) + 32;
    end;
datalines;
State College, PA  -2 -2  2  8 14 19 21 20 16 10  4 -1

;
run;

proc print data = avgtempsFtwo;
    title 'Average Monthly Temperatures in Fahrenheit';
	id City;
	var jan--dec;
run;
```

#### Create Var Array

```sas

data avgtemps;
    set avgcelsius;
    array celsius(12) jan feb mar apr may jun
                        jul aug sep oct nov dec;
    array fahr(12) janf febf marf aprf mayf junf
                    julf augf sepf octf novf decf;
    do i = 1 to 12;
            fahr(i) = 1.8*celsius(i) + 32;
    end;
run;

proc print data = avgtemps;
    title 'Average Monthly Temperatures';
    id City;
    var jan janf feb febf mar marf;
    var apr aprf may mayf jun junf;
    var jul julf aug augf sep sepf;
    var oct octf nov novf dec decf;
run;


data avgtempsinF;
    set avgcelsius;
    array celsius(12) jan feb mar apr may jun
                      jul aug sep oct nov dec;
	/*
      We specify how many elements the fahr array should contain (12),
	  but we do not specify any variables to group into the array.
	  In this situation, SAS creates default names by concatenating the array
	  name and the numbers 1, 2, 3, and so on.
	  For example, SAS creates the names fahr1, fahr2, fahr3, ..., up to fahr12.
	*/
    array fahr(12);
    do i = 1 to 12;
            fahr(i) = 1.8*celsius(i) + 32;
    end;
run;

proc print data = avgtempsinF;
    title 'Average Monthly Temperatures in Fahrenheit';
    id City;
    var fahr1-fahr12;
run;

```

#### Array Bound

Use the `DIM` function to change the upper bound of a DO loop's index variable dynamically.

- The following program reads the `yes/no responses` of five subjects to six survey questions
  (q1, q2, ..., q6) into a temporary SAS data set called survey.
- A yes response is coded and entered as a 2, while a no response is coded and entered as a 1. Just four of the variables (q3, q4, q5, and q6) are stored in a one-dimensional array called qxs.
- Then, a DO LOOP, in conjunction with the DIM function, is used to recode the responses to the four variables so that a 2 is changed to a 1, and a 1 is changed to a 0:
- `drop = i` means removing index var

```sas
data survey (drop = i);
	input subj q1 q2 q3 q4 q5 q6;
	array qxs(4) q3-q6;
	/*DIM function returns the number of the elements in the array
	(instead 4, use dim(qxs))*/
	do i = 1 to dim(qxs);
		qxs(i) = qxs(i) - 1;
	end;
datalines;
1001 1 2 1 2 1 1
1002 2 1 2 2 2 1
1003 2 2 2 1 . 2
;
run;

proc print data = survey noobs;
	title 'The survey data using dim function';
run;

```

Define the lower and upper bounds of a one-dimensional array to create a bounded array

- `qxs(3:6)` = 3,4,5,6
- `lbound(qxs)` and `hbound(qxs)`

```sas
data survey2 (drop = i);
	input subj q1 q2 q3 q4 q5 q6;
	array qxs(3:6) q3-q6;
	do i = 3 to 6;
		qxs(i) = qxs(i) - 1;
	end;
datalines;
1001 1 2 1 2 1 1
;
run;

data survey3 (drop = i);
	input subj q1 q2 q3 q4 q5 q6;
	array qxs(*) q3-q6;
   /* Asterisk (*) is used to tell SAS to determine the dimension of the qxs array*/
	do i = lbound(qxs) to hbound(qxs);
		qxs(i) = qxs(i) - 1;
	end;
datalines;
1001 1 2 1 2 1 1

;
run;

```

#### Temporary Arrays

Example that uses a temporary array to store the correct answer for each of 10 questions on a multiple-choice quiz.

- You can then score the quiz using the temporary array as the answer key as follows.

Create a temporary array. _TEMPORARY_ tells SAS that this is a temporary array

- and the 10 values in parentheses are the initial values for each of the elements of this array.
- It is important to remember that there are no corresponding variables (Key1, Key2, and so on) in this DATA step.

```sas

data score (drop = Ques);
	array ans(10) $ 1;
 	array key(10) $ 1 _temporary_ ('A','B','C','D','E','E','D','C','B','A');

 input ID (Ans1-Ans10) ($1.);

 RawScore = 0;
 do Ques = 1 to 10;
	RawScore = RawScore + (key(Ques) = ans(Ques));* TRUE SAS wil convert it to 1, if FALSE then SAS will convert to 0;
 end;
 Percent = 100*RawScore/10;
 *keep ID RawScore Percent;
datalines;
123 ABCDEDDDCA
126 ABCDEEDCBA
129 DBCBCEDDEB
;
run;

proc print data = score noobs;
run;


```

{{< figure src="/images/sas/array4.jpg" width="400">}}

#### 2d array

The following program reads 14 family history variables (fhx1, ..., fhx14)

- arising from five subjects and stores the data in a one-dimensional array called edit.
- SAS searches the edit array to determine whether or not any data values are missing.
- Fourteen (14) status variables (stat1, ..., stat14) are created to correspond to each of the 14 data variables.
- The status (1 if missing and 0 if nonmissing) is stored in another one-dimensional array called status:

```sas
data fhx;
	input subj v_date mmddyy8. fhx1-fhx14;
	array edit(14) fhx1-fhx14;
	array status(14) stat1-stat14;
	do i = 1 to 14;
		status(i) = 0;
		if edit(i) = . then status(i) = 1;
	end;
datalines;
220004 07/27/93  0  0  0  .  8  0  0  1  1  1  .  1  0  1
410020 11/11/93  0  0  0  .  0  0  0  0  0  0  .  0  0  0
520013 10/29/93  0  0  0  .  0  0  0  0  0  0  .  0  0  1
520068 08/10/95  0  0  0  0  0  1  1  0  0  1  1  0  1  0
520076 08/25/95  0  0  0  0  1  8  0  0  0  1  1  0  0  1
;
run;

proc print data = fhx noobs;
	var fhx1-fhx14;
	title 'The FHX data itself';
run;

proc print data = fhx noobs;
	var stat1-stat14;
	title 'The presence of missing values in FHX data';
run;
```

{{< figure src="/images/sas/2darray.jpg" width="400">}}

This program performs exactly the same task as the previous program, using a two-dimentional array
called edit.

```sas
data fhx2;
	input subj v_date mmddyy8. fhx1-fhx14;
/* History variables (fhx1, ..., fhx14) into the first dimension and
to group the status variables (stat1, ..., stat14) into the second dimension.*/
	array edit(2,14) fhx1-fhx14 stat1-stat14;
	do i = 1 to 14;
		edit(2,i) = 0;
		if edit(1,i) = . then edit(2,i) = 1;
	end;
datalines;
220004 07/27/93  0  0  0  .  8  0  0  1  1  1  .  1  0  1
410020 11/11/93  0  0  0  .  0  0  0  0  0  0  .  0  0  0
520013 10/29/93  0  0  0  .  0  0  0  0  0  0  .  0  0  1
520068 08/10/95  0  0  0  0  0  1  1  0  0  1  1  0  1  0
520076 08/25/95  0  0  0  0  1  8  0  0  0  1  1  0  0  1
;
run;

proc print data = fhx2 noobs;
	var fhx1-fhx14;
	title 'The FHX2 data itself';
run;

proc print data = fhx2 noobs;
	var stat1-stat14;
	title 'The presence of missing values in FHX2 data';
run;

```

