# Course Notes | SFU STAT342 - SAS 


SAS: Statistical Analysis System

```sas
/* Lecture 1, example 1: Read the dataset and print */

data DCStudgrade; /* data step: assign a name for the dataset and enter the data */
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

PROC print data = dcstudgrade; /* proc step: perform any analysis and  print the dataset.
                              Here we are only printing the dataset*/
run;


/* View discriptor portion of the dataset 'Studgrade'.*/

/*proc contents data = Studgrade;
run;*/

```

