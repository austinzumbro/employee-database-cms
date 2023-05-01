const inquirer = require("inquirer");
const mysql = require('mysql2');
const config = require('../config/config');
const Query = require('./query');

const db = mysql.createConnection(config.mysql,
    console.log('Connected to company_db database.')
);

const query = new Query;

class CLI {
    constructor() {
        this.initialPrompt = [
            {
                name: "option",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "View Employees by Department",
                    "View Employees by Manager",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee's Role",
                    "Update an Employee's Manager",
                    "View Total Utilized Budget of a Department",
                    "Exit Program"
                ]
            }
        ];
    }

    start() {
        return inquirer.prompt(this.initialPrompt)
    }

    viewAll(queryString) {
        db.query(queryString, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                console.table(results);
                this.start().then((data) => this.parseResponse(data.option));
            }
        });
    }

    viewEmployeesByDept() {
        db.query(query.getAllDepartments, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                let deptArray = results;
                let deptNames = deptArray.map((obj) => obj.name);
                inquirer.prompt([
                    {
                        name: "department",
                        type: "list",
                        message: "Select a Department",
                        choices: deptNames
                    }
                ]).then((department) => {
                    const chosenDept = deptArray.find((obj) => obj.name === department.department);
                    db.query(query.viewAllEmployeesByDept, chosenDept.id, (err, results) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.table(results);
                            this.start().then((data) => this.parseResponse(data.option));
                        }
                    })
                })
            }
        })
    }

    viewEmployeesByManager() {
        db.query(query.getAllEmployees, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                let employeeArray = results;
                let managerIDs = employeeArray.map((obj) => obj.manager_id);
                managerIDs = managerIDs.filter((value, index, self) => {
                    return typeof value === 'number' && self.indexOf(value) === index;
                });
                let managerArray = employeeArray.filter((employee) => {
                    return managerIDs.includes(employee.id);
                })
                let managerNames = managerArray.map((obj) => obj.first_name + " " + obj.last_name);
                inquirer.prompt([{
                    name: "manager",
                    type: "list",
                    message: "Select a Manager",
                    choices: managerNames
                }]).then((manager) => {
                    const chosenManager = managerArray.find((obj) => obj.first_name + " " + obj.last_name === manager.manager);
                    db.query(query.viewEmployeesByManager, chosenManager.id, (err, results) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.table(results);
                            this.start().then((data) => this.parseResponse(data.option));
                        }
                    })
                })
            }
        });
    }

    addDepartment() {
        inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "Enter the name of the new department."
            },
        ]).then((department) => {
            db.query(query.addDepartment, department.name, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Department created!");
                    this.start().then((data) => this.parseResponse(data.option));
                }
            })

        })
    }

    async addRole() {
        let departments = await db.promise().query(query.getAllDepartments);
        departments = departments[0];
        const departmentNames = departments.map((department) => department.name);

        const userInput = await inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "Enter the name of the new role."
            },
            {
                name: "salary",
                type: "input",
                message: "Enter the salary for the role."
            },
            {
                name: "department",
                type: "list",
                message: "Select the department to which this role belongs.",
                choices: departmentNames
            }
        ]);

        const chosenDepartment = departments.find((obj) => obj.name === userInput.department);
        const insertArray = [userInput.name, userInput.salary, chosenDepartment.id];

        try {
            await db.promise().query(query.addRole, insertArray);
            console.log("Role created!")
        } catch (err) {
            console.error(err);
        } finally {
            this.start().then((data) => this.parseResponse(data.option));
        }
    }

    async addEmployee() {
        let departments = await db.promise().query(query.getAllDepartments);
        departments = departments[0];

        let roles = await db.promise().query(query.getAllRoles);
        roles = roles[0];

        let managers = await db.promise().query(query.getAllEmployees);
        managers = managers[0];

        const departmentNames = departments.map((department) => department.name);
        const roleNames = roles.map((role) => role.name);
        const managerNames = managers.map((manager) => `${manager.first_name} ${manager.last_name}`);

        const userInput = await inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter the new employee's FIRST NAME."
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter the new employee's LAST NAME."
            },
            {
                name: "department",
                type: "list",
                message: "Select the new employee's DEPARTMENT.",
                choices: departmentNames
            },
            {
                name: "role",
                type: "list",
                message: "Select the new employee's ROLE.",
                choices: roleNames
            },
            {
                name: "manager",
                type: "list",
                message: "Select the new employee's MANAGER.",
                choices: managerNames
            },
            {
                name: "salary",
                type: "input",
                message: "Please enter the new employee's ANNUAL SALARY."
            }
        ]);

        const chosenDepartment = departments.find((obj) => obj.name === userInput.department);
        const chosenRole = roles.find((obj) => obj.name === userInput.role);
        const chosenManager = managers.find((obj) => `${obj.first_name} ${obj.last_name}` === userInput.manager);
        const insertArray = [userInput.first_name, userInput.last_name, chosenDepartment.id, chosenRole.id, chosenManager.id, userInput.salary];

        try {
            await db.promise().query(query.addEmployee, insertArray);
            console.log("Employee added!");
        } catch (error) {
            console.error(error)
        } finally {
            return this.start().then((data) => this.parseResponse(data.option));
        }
    }

    async updateEmployeeRole() {
        let roles = await db.promise().query(query.getAllRoles);
        roles = roles[0];

        let employees = await db.promise().query(query.getAllEmployees);
        employees = employees[0];

        const roleNames = roles.map((role) => role.name);
        const employeeNames = employees.map((employee) => `${employee.first_name} ${employee.last_name}`);

        let userInput = await inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Select the employee whose ROLE you'd like to update.",
                choices: employeeNames
            },
            {
                name: "role",
                type: "list",
                message: "Select the employee's new role.",
                choices: roleNames
            }
        ]);

        const chosenEmployee = employees.find((obj) => `${obj.first_name} ${obj.last_name}` === userInput.employee);
        const chosenRole = roles.find((obj) => obj.name === userInput.role);
        const updateArray = [chosenRole.id, chosenEmployee.id];

        try {
            let update = await db.promise().query(query.updateEmployeeRole, updateArray);
        } catch (error) {
            console.error(error)
        } finally {
            console.log("Employee role updated!")
            return this.start().then((data) => this.parseResponse(data.option));
        }
    }

    async updateEmployeeManager() {
        let employees = await db.promise().query(query.getAllEmployees);
        employees = employees[0];
        const employeeNames = employees.map((employee) => `${employee.first_name} ${employee.last_name}`);

        let userInputEmployee = await inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Select the employee whose MANAGER you'd like to update.",
                choices: employeeNames
            }
        ]);

        const chosenEmployee = employees.find((obj) => `${obj.first_name} ${obj.last_name}` === userInputEmployee.employee);
        const possibleManagers = employees.filter(employee => employee.id !== chosenEmployee.id);
        const possibleManagerNames = possibleManagers.map((manager) => `${manager.first_name} ${manager.last_name}`);

        let userInputManager = await inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Select the employee's new MANAGER.",
                choices: possibleManagerNames
            }
        ]);

        const chosenManager = possibleManagers.find((obj) => `${obj.first_name} ${obj.last_name}` === userInputManager.manager);
        const updateArray = [chosenManager.id, chosenEmployee.id];

        try {
            let update = await db.promise().query(query.updateEmployeeManager, updateArray);
        } catch (error) {
            console.error(error)
        } finally {
            console.log("Employee role updated!")
            return this.start().then((data) => this.parseResponse(data.option));
        }
    }

    async viewUtilizedBudget() {
        let departments = await db.promise().query(query.getAllDepartments);
        departments = departments[0];
        const departmentNames = departments.map((department) => department.name);

        let userInput = await inquirer.prompt([
            {
                name: "department",
                type: "list",
                message: "Select the department whose TOTAL UTILIZED BUDGET you wish to view.",
                choices: departmentNames
            }
        ]);

        const chosenDepartment = departments.find((obj) => obj.name === userInput.department);
        try {
            let budget = await db.promise().query(query.viewUtilizedBudget, chosenDepartment.id);
            budget = budget[0][0];
            console.log(`The total utilized budget of ${chosenDepartment.name} is $${Object.values(budget)[0]}`);
        } catch (error) {
            console.error(error)
        } finally {
            return this.start().then((data) => this.parseResponse(data.option));
        }
    }

    parseResponse(response) {
        switch (response) {
            case "View All Departments":
                this.viewAll(query.viewAllDepartmentsClean);
                break;

            case "View All Roles":
                this.viewAll(query.viewAllRolesClean);
                break;

            case "View All Employees":
                this.viewAll(query.viewAllEmployeesClean);
                break;

            case "View Employees by Department":
                this.viewEmployeesByDept();
                break;

            case "View Employees by Manager":
                this.viewEmployeesByManager();
                break;

            case "Add a Department":
                this.addDepartment();
                break;

            case "Add a Role":
                this.addRole();
                break;

            case "Add an Employee":
                this.addEmployee();
                break;

            case "Update an Employee's Role":
                this.updateEmployeeRole();
                break;

            case "Update an Employee's Manager":
                this.updateEmployeeManager();
                break;

            case "View Total Utilized Budget of a Department":
                this.viewUtilizedBudget();
                break;

            case "Exit Program":
                db.end();
                break;
        }
    }
}

module.exports = CLI;