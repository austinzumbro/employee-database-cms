const mysql = require('mysql2');
const config = require('./config/config');
const CLI = require('./lib/cli');
const QUERY = require('./lib/query');

const cli = new CLI;
const query = new QUERY;

const db = mysql.createConnection(config.mysql,
    console.log('Connected to company_db database.')
);

function init() {
    cli.start().then((response) => {
        console.log(response.option);
        init();

    })
}

init();
