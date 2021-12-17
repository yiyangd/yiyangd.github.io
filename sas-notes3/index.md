# SAS Notes 03 | Tutorials and SQL


### Week 11

#### Do Group

Read exam data into sas environment.

- Compute Total_1 = Assignment_20 + Mid_30 + Final_50
- Compute Total_2 = (Mid_30 + Final_50) \* 100 / 80
- Assign higher of Total_1 and Total_2 as the Grand_Total
- If Grand_Total>50 then pass and if not fail

```sas
data exam;
    infile "/home/u59686016/STAT342T/exam.txt";
    input SID $ Assignment_20 Mid_30 Final_50;
run;

proc print data = exam;
	title 'Exam Data';
run;

data grades;
  set exam;

  Total_1 = Assignment_20 + Mid_30 + Final_50;
  Total_2 = (Mid_30 + Final_50) * (100/80);

  if Total_1>Total_2 then do;
        Grand_Total = Total_1;
        if Grand_Total > 50 then Grade = 'Pass';
        else Grade = 'Fail';
  end;

  if Total_2 > Total_1 then do;
        Grand_Total = Total_2;
        if Grand_Total > 50 then Grade = 'Pass';
        else Grade = 'Fail';
  end;
run;

proc print data=grades;
	var SID -- Total_1 Total_2 Grand_Total Grade;
run;
```

#### Do Loop (Graph)

```sas
/* Do Loop */

/* Integer range */
/* Generate a random sample of 10, 100, 1000 and 10000 observations from a N(5,2) and find the sample mean and standard deviation */
data randnorm;
	do x=1 to 10000;
		norm = rand('normal', 5, 2);
		output;
	end;
run;

/* proc print data = randnorm; */
/* run; */

proc means data=randnorm mean std;
	var norm;
run;

proc univariate data=randnorm;
	var norm;
	histogram;
run;

/* Decimal range */
/* Plot the pdf of a normal distribution with mean 5 and standard deviation 2 when -1 < x < 11 */
data normpdf;
    norm_mean = 5;
	norm_sd   = 2;
    pi=constant("pi");
	do x=-1 to 11 by 0.001;
		y = 1/(sqrt(2*Pi)*norm_sd) * exp(-(0.5)*((x-norm_mean)/norm_sd)**2); /* pdf of normal distribution */
		output;
	end;
run;

proc print data = normpdf (obs = 10);
run;

proc gplot data=normpdf;
	plot y*x;
run;
quit;
```

#### Do Until

`output`: count = 0,1,2,3,4； n = 1,2,3,4,5

```sas
/* Do Until */

/* Print 0 to 4 */
data count4;
    n=0;
   	do until(n>=5);
   		count = n;
    	n+1;
    	output;
   	end;
run;

proc print data = count4;
run;
```

#### DO While

```sas
/* Do While */

/* Print 0 to 4 */
data count4while;
    n=0;
   	do while(n<5);
   		count = n;
    	n+1;
    	output;
   	end;
run;

proc print data = count4while;
run;




/* Approximate the P(-1<=X<=5) when X ~ N(5,2) */
data norm_prob1;
    norm_mean = 5;
	norm_sd   = 2;
	pi        = constant("pi");
	x         = -0.9999;
	prob      = 0;

	do until (x >= 5.0001);
		temp_prob = (1/(sqrt(2*Pi)*norm_sd) * exp(-(0.5)*((x-norm_mean)/norm_sd)**2))/10000;
		/* pdf of normal distribution, devide by 10000 (frequancy) make a probability */
		prob      = prob + temp_prob;
		endpoint = x;
		x         = x + 0.0001;
	end;
run;

proc print data=norm_prob1;
title'norm_prob1';
run;



/* Do While */
/* Approximate the P(-1<=X<=5) = 0.5 when X ~ N(5,2)*/
data norm_prob2;
    norm_mean = 5;
	norm_sd   = 2;
	pi        = constant("pi");
	x         = -0.9999;
	prob      = 0;

	do while (x < 5.0001);
		temp_prob = (1/(sqrt(2*Pi)*norm_sd) * exp(-(0.5)*((x-norm_mean)/norm_sd)**2))/10000; /* pdf of normal distribution */
		prob      = prob + temp_prob;
		endpoint = x;
		x         = x + 0.0001;
	end;
run;

proc print data=norm_prob2;
 title'norm_prob2';
run;
```

#### Leave and Continue

```sas
/* LEAVE */
/* Approximate the P(-1<=X<=5) when X ~ N(5,2)*/
data norm_prob3;
    norm_mean = 5;
	norm_sd   = 2;
	pi        = constant("pi");
	x         = -0.9999;
	prob      = 0;

	do x=-0.9999 to 11 by 0.0001;

	    if x >= 5.0001 then leave;

		temp_prob = (1/(sqrt(2*Pi)*norm_sd) * exp(-(0.5)*((x-norm_mean)/norm_sd)**2))/10000; /* pdf of normal distribution */
		prob      = prob + temp_prob;
		endpoint = x;
    end;
run;

proc print data=norm_prob3;
title'norm_prob3';
run;


/* CONTINUE */
/* Approximate the P(-1<=X<=5) when X ~ N(5,2) */
data norm_prob4;
    norm_mean = 5;
	norm_sd   = 2;
	pi        = constant("pi");
	x         = -0.9999;
	prob      = 0;

	do x=-0.9999 to 11 by 0.0001;

	    if x >= 5.0001 then continue;

		temp_prob = (1/(sqrt(2*Pi)*norm_sd) * exp(-(0.5)*((x-norm_mean)/norm_sd)**2))/10000; /* pdf of normal distribution */
		prob      = prob + temp_prob;
        endpoint = x;

	end;
run;

proc print data=norm_prob4;
run;


/* Sum of 1, 3, 5, ..., 1001 in steps of 2 */
data sum1;
    sum = 0;
	do x=1 to 1001 by 2;
		sum = sum + x;
		output;
	end;
run;


proc print data=sum1;
run;

/* Sum of 1, -1, -3, ..., -1001 in steps of 2 */
data sum2;
    sum = 0;
	do x=1 to -1001 by -2;
		sum = sum + x;
		output;
	end;
run;

proc print data=sum2;
run;


```

#### Combine Data

```sas
proc import datafile="/home/u59686016/STAT342T/President_ID1.xlsx"
   DBMS=xlsx out=pres_id1;
run;

proc print data = pres_id1 noobs;
	title 'President Data';
run;

proc import datafile="/home/u59686016/STAT342T/President_ID2.xlsx"
   DBMS=xlsx out=pres_id2;
run;

proc print data = pres_id2 noobs;
	title 'President Data';
run;

data pres_combined;
 set pres_id1 pres_id2;
run;

proc print data = pres_combined noobs;
run;

proc sort data = pres_combined;
by ID;
run;

proc print data = pres_combined noobs;
run;
```

#### Interleaving Datasets

```sas
/* Interleaving datasets */

proc import datafile="/home/u59686016/STAT342T/President_ID1.xlsx"
   DBMS=xlsx out=pres_id1;
run;

proc sort data = pres_id1;
by ID;
run;

proc print data = pres_id1 noobs;
	title 'President Data';
run;

proc import datafile="/home/u59686016/STAT342T/President_ID2.xlsx"
   DBMS=xlsx out=pres_id2;
run;

proc sort data = pres_id2;
by ID;
run;

proc print data = pres_id2 noobs;
	title 'President Data';
run;

data interleave;
 set pres_id1 pres_id2;
 by ID; /*Datasets should be sorted according to the by variable*/
run;

proc print data = interleave noobs;
	title 'President Data';
run;
```

#### Merge

```sas
proc import datafile="/home/u59686016/STAT342T/President_MERGE1.xlsx"
   DBMS=xlsx out=pres_mr1;
run;

proc sort data = pres_mr1;
by ID;
run;

proc print data = pres_mr1 noobs;
	title 'President Data';
run;

proc import datafile="/home/u59686016/STAT342T/President_MERGE2.xlsx"
   DBMS=xlsx out=pres_mr2;
run;

proc sort data = pres_mr2;
by ID;
run;

proc print data = pres_mr2 noobs;
	title 'President Data';
run;

data merged;
 merge pres_mr1 pres_mr2;
 by ID;
run;

proc print data = merged noobs;
run;

```

### Last Tut

#### Use Do and Array to replace Missing

```sas

/**************************************************************************/
/***                 Working with Arrays                                ***/
/**************************************************************************/


/* Replacing 999 with Missing Values in Multiple Numeric Variables within a loop */
/* Missing values are indicated by 999. Objective is to replace all such values with a period ".". */

data missVar;
	infile '/home/u59686016/STAT342T/AHW.txt';
	input Age Height Weight;
run;

title 'Age, Height and Weight Data';
proc print data=missVar;
run;


/* With regular if condition */
data missVar1;
	set missVar;

	if Age=999 then Age=.;
	if Height=999 then Height=.;
	if Weight=999 then Weight=.;
run;

title 'With regular if conditions';
proc print data=missVar1;
run;


/* With Arrays and use of Do loop */
/* data missVar2; */
data missVar2 (drop=i);
	set missVar;

	array AHWvar(3) Age Height Weight; /*we could even use _numeric_ istead of specifying variable names*/

	do i=1 to dim(AHWvar);
		if AHWvar(i)=999 then AHWvar(i)=.;
	end;
run;

title 'Use of Arrays and Do Loop';
proc print data=missVar2;
run;

```

