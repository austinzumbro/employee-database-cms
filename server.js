const CLI = require('./lib/cli');
const figlet = require('figlet');
const cli = new CLI;

function init() {
    cli.start().then((response) => {
        cli.parseResponse(response.option);

    })
}

// figlet.text(
//     "Employee Database CMS",
//     {
//         font: "Broadway",
//         horizontalLayout: "default",
//         verticalLayout: "default",
//         width: 200,
//         whitespaceBreak: true,
//     },
//     function (err, data) {
//         if (err) {
//             console.log("Something went wrong...");
//             console.dir(err);
//             return;
//         }
//         console.log(data);
//     }
// );

init();
