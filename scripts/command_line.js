const memes = require('./memes'), news = require('./news'), temporary_storage = require('./temporary_storage.js'),
    database_test = require('./database_test'), security = require('./security.js');
const commands = [
    {
        name: "signed_in", information: "signed_in: displays all signed in users", extra: value => {
            console.log(temporary_storage.users);
        }
    },
    {
        name: "new_user", information: "new_user USERNAME PASSWORD EMAIL: adds a new user, doesn't need email", extra: value => {
            security.sign_up(value[1], value[2], value[3]);
        }
    }
]

function start() {
    console.log("Command Line, type help to get commands")
    /*command line*/
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (text) {
        if (text.replace("\n", "").split(" ")[0] === "help") {
            console.log("Commands")
            commands.forEach(value => {
                console.log(value.information)
            });
        }
        commands.forEach(value => {
            if (text.replace("\n", "").split(" ")[0] === value.name) {
                value.extra(text.replace("\n", "").split(" "))
            }
        });
    });
}

exports.start = start;
