const prompts = [
    {
        name: "option",
        type: "select",
        options: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee's Role",
            "Update an Employee's Manager",
            "View Total Utilized Budget of a Department"
        ]
    }
];

module.exports = prompts;