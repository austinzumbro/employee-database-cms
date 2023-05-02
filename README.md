# Employee Database CMS

## Description

This week, I'm exploring SQL queries! I've been looking forward to implementing a MySQL database, because I have a lot of experience working with [CiviCRM](https://civicrm.org), an open-source CRM that we used at Bay Area Children's Theatre to run all of our ticketing, class registration, and donation systems.

For this project, I'm planning to create a command-line app where I can practice running SQL queries out of Node.js.  I'm setting myself the following challenge:

| **Scenario**                                                                                                                                                                                                                                                                                                                                                                     |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _As a hypothetical business owner, I'd like an application that allows me to see and interact with my employee data. I'd like to be able to see a list of departments, roles, employees, etc. I'd like to be able to update and add to those lists. I'd like to be able to see the sum total of a given department's salaries._ |

The resulting content management system uses the node package [mysql2](https://www.npmjs.com/package/mysql2) to connect to an employee database. You can interact with the data via a series of console prompts, implemented via the node package [inquirer](https://www.npmjs.com/package/inquirer).

Here it is in action:

![GIF of the App in Use](./img/app-in-use.gif)

---

## Usage

The app is pretty limited in its scope, but if you want to play around with it yourself, feel free.  

1. Run `npm i` to install dependencies.
2. Create the MySQL databases. The table structure in `schema.sql` will work with the code as it's currently written. Feel free to use `seeds.sql` to populate the tables or, of course, you can use your own data.

    > *All data in the included 'seeds.sql' document is completely fictional. Any resemblance to real-life persons or positions is coincidental and unintended.*

3. Run `npm start` or `node server.js`. When the program loads, select your option.

---

## My Approach

### Working with `mysql2` and `inquirer`

`mysql2` utilizes callback functions (unless you specifiy that it return a promise) and `inquirer` returns a promise. 

The simple queries I started with were straightforward enough that I got in the habit of just nesting and switching between the two, but as I got further along into more complicated user behavior, I started getting confused: calling promises inside of promises, writing returns prematurely inside of callbacks, etc. etc. etc.

To clean it up, I switched over to using async/await on the more complicated user flows, which *really* helped with readability.  

For example, to add an employee, I needed to first pull a list of roles and a list of existing employees (to serve as the new employee's manager).

```javascript
async addEmployee() {
    // Get all roles out of the database
    let roles = await db.promise().query(query.getAllRoles);
    roles = roles[0];
    // Get all employees out of the database
    let managers = await db.promise().query(query.getAllEmployees);
    managers = managers[0];

    // Map the names into a new array to use as choices on the inquirer prompt
    const roleNames = roles.map((role) => role.name);
    const managerNames = managers.map((manager) => `${manager.first_name} ${manager.last_name}`);

    // Prompt the user to enter employee data
    const userInput = await inquirer.prompt([
        {name: "first_name", type: "input", message: "..."},
        {name: "last_name", type: "input", message: "..."},
        {name: "role", type: "list", message: "...", choices: roleNames},
        {name: "manager", type: "list", message: "...", choices: managerNames},
    ]);

    // Get primary key based on user input
    const chosenRole = roles.find((obj) => obj.name === userInput.role);
    const chosenManager = managers.find((obj) => `${obj.first_name} ${obj.last_name}` === userInput.manager);
    // Put those keys into an array for use in prepared statements
    const insertArray = [userInput.first_name, userInput.last_name, chosenRole.id, chosenManager.id];

    // Run the INSERT INTO query
    try {
        await db.promise().query(query.addEmployee, insertArray);
        console.log("Employee added!");
    } catch (error) {
        console.error(error)
    } finally {
        // Return to the main menu
        return this.start().then((data) => this.parseResponse(data.option));
    }
}
```

---

### Class Structure

I'm sure I could have implemented a more elegant Class structure, but as it is, I only used two: `CLI` and `QUERY`.  They are what they sound like.  `CLI` contains all the methods associated with running the command line interface.  `QUERY` contains all the query strings.

---

### Formatting SQL Responses

Once I got everything up and running, it was fun to go back in and clean up some of the MySQL responses so they looked nicer on the console tables.

```sql
SELECT 
    employees.id,
    CONCAT( employees.first_name, " ", employees.last_name) AS Name, 
    COALESCE (departments.name, "") AS Department, 
    roles.name AS Role, 
    roles.salary AS Salary, 
    COALESCE (CONCAT(managers.first_name, " ", managers.last_name), "") AS Manager
FROM employees 
LEFT JOIN roles ON employees.role_id = roles.id 
LEFT JOIN departments ON roles.dept_id = departments.id 
LEFT JOIN employees AS managers ON employees.manager_id = managers.id
ORDER BY dept_id, salary DESC`;
```

## Learnings and Reflections

- I like writing SQL! It's been a few months since I interacted with a MySQL database, but it turns out it's like riding a bike. I get the impression that enjoying SQL is kind of like saying, "I enjoy No.2 pencils."  But I do also have a fondness for No.2 pencils, so there you go.

- Now that I've really got a handle on async/await, my earlier confusion with nesting promises and callbacks seems silly. But I did read a few extensive blog posts on the topic while I was figuring it out, so I figure I can't be the only one who's gone through it.

- I continue to strongly dislike `inquirer` as a means of collecting user input, but I have only myself to blame for using it over and over.
