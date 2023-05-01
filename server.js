const CLI = require('./lib/cli');
const figlet = require('figlet');
const cli = new CLI;

function init() {
    figlet("\n\nEmployee Manager\n\n", { font: "slant" }, function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(data);
        cli.start().then((response) => {
            cli.parseResponse(response.option);

        })
    })
}

init();
