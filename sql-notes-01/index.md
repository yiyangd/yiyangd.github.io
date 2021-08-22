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

### 182. Duplicate Emails

> Write a SQL query to find all duplicate emails in a table named `Person`.

#### Solution - GROUP BY and HAVING

```sql
# Person (Id int, Email varchar(255))
SELECT Email
FROM Person
GROUP BY Email
HAVING count(Email) > 1;
```

### 183. Customers Who Never Order

> Suppose that a website contains two tables, the `Customers` table and the `Orders` table. Write a SQL query to find all `customers` who never order anything.

#### Solution 1 - NOT IN

```sql
# Customers (Id int, Name varchar(255))
# Orders (Id int, CustomerId int)
SELECT Customers.Name AS Customers
FROM Customers
WHERE Customers.Id NOT IN (SELECT Customerid FROM Orders);
```

#### Solution 2 - LEFT JOIN

```sql
# Customers (Id int, Name varchar(255))
# Orders (Id int, CustomerId int)
SELECT Customers.Name as Customers
FROM Customers
LEFT JOIN Orders
ON Customers.Id=Orders.CustomerId
WHERE Orders.CustomerId IS NULL;
```

### 184. Department Highest Salary

> Write a SQL query to find employees who have the highest salary in each of the departments.

#### Solution - Inner Join

`Employee` cannot find the empty `Department` when using `LEFT JOIN`

```sql
# Employee (Id int, Name varchar(255), Salary int, DepartmentId int)
# Department (Id int, Name varchar(255))
SELECT
    Department.name AS 'Department',
    Employee.name AS 'Employee',
    Salary
FROM Employee JOIN Department
ON Employee.DepartmentId = Department.Id
WHERE (Employee.DepartmentId , Salary) IN
    (   SELECT DepartmentId, MAX(Salary)
        FROM Employee
        GROUP BY DepartmentId
    )
;
```

### 185. Department Top Three Salaries

> Write an SQL query to find the employees who has a salary in the top three unique salaries in each of the departments.

#### Solution 1 - Using JOIN and sub-query

A top 3 salary in this company means there is no more than 3 salary bigger than itself in the company.

```sql
# Employee (Id int, Name varchar(255), Salary int, DepartmentId int)
# Department (Id int, Name varchar(255))
SELECT Department.Name AS Department, e1.Name AS Employee, e1.Salary
FROM Employee e1 JOIN Department ON e1.DepartmentId = Department.Id
WHERE
    3 > (SELECT COUNT(DISTINCT e2.Salary)
        FROM Employee e2
        WHERE e2.Salary > e1.Salary
        AND e1.DepartmentId = e2.DepartmentId
        )
;
# e.g.e1 = e2 = [4,5,6,7,8]
# - e1.Salary = 4，e2.Salary => [5,6,7,8]，count(DISTINCT e2.Salary) = 4
# - e1.Salary = 5，e2.Salary => [6,7,8]，count(DISTINCT e2.Salary) = 3
# - e1.Salary = 6，e2.Salary => [7,8]，count(DISTINCT e2.Salary) = 2 `< 3`
# - e1.Salary = 7，e2.Salary => [8]，count(DISTINCT e2.Salary) = 1 `< 3`
# - e1.Salary = 8，e2.Salary =>  []，count(DISTINCT e2.Salary) = 0 `< 3`
# - 3 > count(DISTINCT e2.Salary)， Top3 = [6,7,8]
```

#### Solution 2 -

