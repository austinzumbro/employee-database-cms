class QUERY {
    constructor() {
        this.getAllDepartments = `SELECT * FROM departments`;
        this.viewAllDepartmentsClean = `SELECT name AS Departments FROM departments`;
        this.getAllRoles = `SELECT * FROM roles`;
        this.viewAllRolesClean = `  SELECT roles.name AS Roles, COALESCE(departments.name,"") AS Department 
                                    FROM roles
                                    LEFT JOIN departments ON departments.id = roles.dept_id 
                                    ORDER BY dept_id, salary DESC`;
        this.getAllEmployees = 'SELECT * FROM employees';
        this.viewAllEmployeesClean = `  SELECT 
                                            CONCAT( employees.first_name, " ", employees.last_name) AS Name, 
                                            COALESCE (departments.name, "") AS Department, 
                                            roles.name AS Role, 
                                            COALESCE (CONCAT(managers.first_name, " ", managers.last_name), "") AS Manager, 
                                            roles.salary
                                        FROM employees 
                                        LEFT JOIN roles ON employees.role_id = roles.id 
                                        LEFT JOIN departments ON roles.dept_id = departments.id 
                                        LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                                        ORDER BY dept_id, salary DESC`;
        this.viewAllEmployeesByDept = ` SELECT 
                                            CONCAT( employees.first_name, " ", employees.last_name) AS Name, 
                                            COALESCE (departments.name, "") AS Department, 
                                            roles.name AS Role, 
                                            COALESCE (CONCAT(managers.first_name, " ", managers.last_name), "") AS Manager, 
                                            roles.salary
                                        FROM employees 
                                        LEFT JOIN roles ON employees.role_id = roles.id 
                                        LEFT JOIN departments ON roles.dept_id = departments.id 
                                        LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                                        WHERE departments.id = ?`;
        this.viewEmployeesByManager = ` SELECT 
                                            CONCAT( employees.first_name, " ", employees.last_name) AS Name, 
                                            COALESCE (departments.name, "") AS Department, 
                                            roles.name AS Role, 
                                            COALESCE (CONCAT(managers.first_name, " ", managers.last_name), "") AS Manager, 
                                            roles.salary
                                        FROM employees 
                                        LEFT JOIN roles ON employees.role_id = roles.id 
                                        LEFT JOIN departments ON roles.dept_id = departments.id 
                                        LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                                        WHERE employees.manager_id = ?
                                        ORDER BY departments.id`;
        this.addDepartment = `INSERT INTO departments (name) VALUES (?)`;
        // "Add a Department",
        this.addRole = `INSERT INTO roles (name, salary, dept_id) VALUES (?, ?, ?)`;
        // "Add a Role",
        this.addEmployee = `INSERT INTO employees (first_name, last_name, dept_id, role_id, manager_id, salary) 
                            VALUES (?, ?, ?, ?, ?, ?)`
        // "Add an Employee",
        this.updateEmployeeRole = `UPDATE employees SET role_id = ? WHERE id = ?`;
        // "Update an Employee's Role",
        this.updateEmployeeManager = `UPDATE employees SET manager_id = ? WHERE id = ?`;
        // "Update an Employee's Manager",
        this.viewUtilizedBudget = `SELECT SUM(salary) FROM employees WHERE dept_id = ?`;
        // "View Total Utilized Budget of a Department",
        // "Exit Program"


    }
}

module.exports = QUERY;
