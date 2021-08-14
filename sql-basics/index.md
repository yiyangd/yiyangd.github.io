# SQL Basics


### Create Table

```Syntax
CREATE TABLE tableName (
col1 <dataType> <Restrictions>,
col2 <dataType> <Restrictions>,
col3 <dataType> <Restrictions>,
<Primary Key or Index definitions>);
```

Create Table `Actors`

```sql
CREATE TABLE Actors (
FirstName VARCHAR(20),
SecondName VARCHAR(20),
DoB DATE,
Gender ENUM('Male','Female','Other'),
MaritalStatus ENUM('Married', 'Divorced', 'Single'),
NetWorthInMillions DECIMAL);
```

