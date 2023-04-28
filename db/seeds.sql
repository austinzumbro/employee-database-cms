INSERT INTO departments (name)
VALUES ("Finance and Accounting"),
       ("Sales and Marketing"),
       ("Customer Service"),
       ("Research and Development"),
       ("Human Resources");


INSERT INTO roles (name)
VALUES  ("CEO/Executive Director"),
        ("CFO/Chief Financial Officer"),
        ("Director"),
        ("Manager"),
        ("Analyst"),
        ("Talent Acquisition Specialist"),
        ("Account Executive"),
        ("Research Scientist"),
        ("Customer Service Representative");

INSERT INTO employees (first_name, last_name, dept_id, role_id, manager_id, salary)
VALUES  ('Nia', 'Green', null, 1, null, 150000),
        ('Emily', 'Johnson', 1, 2, 1, 120000),
        ('Maria', 'Santos', 1, 4, 2, 85000),
        ('Mohammed', 'Abdullah', 1, 5, 2, 55000),
        ('Diana', 'Chavez', 5, 4, 1, 90000),
        ('Jasmine', 'Kaur', 5, 6, 5, 65000),
        ('Fatima', 'Khan', 3, 4, 1, 90000),
        ('Mark', 'Johnson', 3, 9, 7, 45000),
        ('Isabella', 'Gomez', 3, 9, 7, 50000),
        ('Mia', 'Nguyen', 4, 3, 1, 110000),
        ('Michael', 'Davis', 4, 8, 10, 80000),
        ('Rahul', 'Sharma', 4, 4, 10, 75000),
        ('Alison', 'Hassan', 2, 3, 1, 110000),
        ('Javier', 'Gonzalez', 2, 5, 13, 90000),
        ('Robert', 'Thompson', 2, 7, 13, 70000);