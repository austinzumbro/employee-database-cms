INSERT INTO departments (name)
VALUES ("Finance and Accounting"),
       ("Sales and Marketing"),
       ("Customer Service"),
       ("Research and Development"),
       ("Human Resources");


INSERT INTO roles (name, salary, dept_id)
VALUES  ("CEO/Executive Director", 150000, null),
        ("CFO/Chief Financial Officer", 120000, 1),
        ("Director of Marketing", 110000, 2),
        ("Director of Research", 110000, 4),
        ("Human Resources Director", 90000, 5),
        ("Customer Relations Manager", 88000, 3),
        ("Financial Analyst", 80000, 1),
        ("Accountant", 86000, 1),
        ("Analyst", 75000, 4),
        ("Talent Acquisition Specialist", 65000, 5),
        ("Account Executive", 50000, 3),
        ("Research Scientist", 80000, 4),
        ("Customer Service Representative", 45000, 3),
        ("Sales Manager", 88000, 2),
        ("Analyst", 67000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Nia', 'Green', 1, null),
        ('Emily', 'Johnson', 2, 1),
        ('Maria', 'Santos', 7, 2),
        ('Mohammed', 'Abdullah', 8, 2),
        ('Diana', 'Chavez', 5, 1),
        ('Jasmine', 'Kaur', 10, 5),
        ('Fatima', 'Khan', 6, 13),
        ('Mark', 'Johnson', 13, 7),
        ('Isabella', 'Gomez', 11, 7),
        ('Mia', 'Nguyen', 4, 1),
        ('Michael', 'Davis', 12, 10),
        ('Rahul', 'Sharma', 9, 10),
        ('Alison', 'Hassan', 3, 1),
        ('Javier', 'Gonzalez', 14, 13),
        ('Robert', 'Thompson', 15, 13);