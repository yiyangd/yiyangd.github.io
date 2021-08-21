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

> Write a SQL query to get the nth highest salary from the `Employee` table.

#### Solution

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
DECLARE M INT;
SET M=N-1;
  RETURN (
      SELECT DISTINCT Salary
      FROM Employee
      ORDER BY Salary DESC
      LIMIT 1 OFFSET M
  );
END
```

### 178. Rank Scores

> Write a SQL query to rank scores. If there is a tie between two scores, both should have the same ranking.

#### Solution 1 - Window Function dense_rank()

The difference between `dense_rank()` and `rank()` is that after a tie, the next ranking number should be the next consecutive integer value when using `dense_rank()`

```sql
SELECT Score,
       dense_rank() OVER(ORDER BY Score DESC) AS `Rank`
FROM Scores;
```

#### Solution 2 - General

A Score's Rank is the count of `Distinct` Score(includes itself) larger or equal to it

```sql
SELECT S1.Score, COUNT(S2.Score) AS `Rank`
FROM Scores S1, (SELECT DISTINCT Score FROM Scores) S2
WHERE S2.Score >= S1.Score
GROUP BY S1.Id
ORDER BY S1.Score DESC;
```

### 180. Consecutive Numbers

> Write an SQL query to find all `numbers` that appear _at least three times consecutively_.

#### Solution

```sql
# Logs (Id int, Num int)
SELECT DISTINCT l1.Num AS ConsecutiveNums
FROM Logs l1, Logs l2, Logs l3
WHERE
    l1.Id = l2.Id - 1 AND l2.Id = l3.Id - 1
    AND l1.Num = l2.Num AND l2.Num = l3.Num
;
```

### 181. Employees Earning More Than Their Managers

> Given the `Employee` table, write a SQL query that finds out employees who earn more than their managers.

#### Solution - Use JOIN ON or WHERE

- `JOIN` and `ON` could be `,` and `WHERE`

```sql
# Employee (Id int, Name varchar(255), Salary int, ManagerId int)
SELECT e1.NAME AS Employee
FROM Employee e1 JOIN Employee e2
ON e1.ManagerId = e2.Id
AND e1.Salary > e2.Salary
;
```

###

