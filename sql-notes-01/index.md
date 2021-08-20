# SQL Practices 01


### 175. Combine Two Table

> Write a SQL query for a report that provides `FirstName`, `LastName`, `City`, `State` for each person in the `Person` table, regardless if there is an address for each of those people
>
> - PersonId and AddressId are primary keys

```sql
Create table Person (PersonId int, FirstName varchar(255), LastName varchar(255))
Create table Address (AddressId int, PersonId int, City varchar(255), State varchar(255))
Truncate table Person
insert into Person (PersonId, LastName, FirstName) values ('1', 'Wang', 'Allen')
Truncate table Address
insert into Address (AddressId, PersonId, City, State) values ('1', '2', 'New York City', 'New York')
```

#### Solution: Outter Join

Since the `PersonId` in table `Address` is the **foreign key** of table `Person`, we can join this two table to get the address information of a person.

- Considering there _might not be an address information_ for every person, we should use _outer join_ instead of the _~default inner join~_.
- Using `where` clause to filter the records will _FAIL_ if there is no address information for a person
  - because it will not display the name information.

```sql
select FirstName, LastName, City, State
from Person left join Address
on Person.PersonId = Address.PersonId
;
```

### 176. Second Highest Salary

> Write a SQL query to get the second highest salary from the `Employee` table.

```sql
Create table If Not Exists Employee (Id int, Salary int)
Truncate table Employee
insert into Employee (Id, Salary) values ('1', '100')
insert into Employee (Id, Salary) values ('2', '200')
insert into Employee (Id, Salary) values ('3', '300')
```

#### Solution 1 - Using sub-query and LIMIT clause

Sort the _distinct salary_ in _descend order_ and then utilize the `LIMIT` clause to get the second highest salary.

```sql
SELECT
    (SELECT DISTINCT Salary
        FROM Employee
        ORDER BY Salary DESC
        LIMIT 1 OFFSET 1) AS SecondHighestSalary

```

#### Solution 2 - Using IFNULL and LIMIT clause

```sql
SELECT
    IFNULL(
      (SELECT DISTINCT Salary
       FROM Employee
       ORDER BY Salary DESC
       LIMIT 1 OFFSET 1),
    NULL) AS SecondHighestSalary
```

### 177. Nth Highest Salary

