const fs = require('fs'), mysql = require('mysql2/promise'), security = require("../scripts/security"),
    xml2js = require('xml2js');
const bible_directory = '..\\data';

function get_bibles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }
        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(file, file.slice(-3));
            if (file.slice(-3) === "xml") {
                fs.readFile(dir + "\\" + file, 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    xml2js.parseString(data, {mergeAttrs: true}, (err, result) => {
                        if (err) {
                            throw err;
                        }

                        const json = JSON.stringify(result, null, 4);
                        fs.writeFile(bible_directory + "\\bibles\\" + file.split(".xml")[0] + ".json", json, function (err) {
                            if (err) return console.log(err);
                            console.log(file.split(".xml")[0] + ".json created");
                        });
                    });
                });
            }
        });
    });
}

function process_references() {
    fs.readdir(bible_directory + "\\bibles", (err, files) => {
        if (err) {
            throw err;
        }
        // files object contains all files names
        // log them on console
        files.forEach(file => {
            fs.readFile(bible_directory + "\\bibles\\" + file, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                console.log(data)
                let data_json = JSON.parse(data)
                let processed_data = {
                    "bible_version": file.split(".json")[0],
                    "file": file,
                    "books": []
                }
                data_json.bible.book.forEach(value => {
                    let information = {
                        "name": value.name[0],
                        "chapters": []
                    }
                    value.chapter.forEach(value1 => {
                        information.chapters.push({
                            'id': value1.name[0],
                            'num_verses': value1.verse.length
                        });
                    });
                    processed_data.books.push(information);
                });
                fs.writeFile(bible_directory + "\\bible_references\\" + file.split(".json")[0] + "_ref" + ".json", JSON.stringify(processed_data), function (err) {
                    if (err) return console.log(err);
                    console.log(file.split(".json")[0] + "_ref" + ".json created");
                });
            });
        });
    });
}

database_upload = async function () {
    let con = await mysql.createConnection(security.database_config);
    let files = ["niv.json"];
    for (const file of files) {
        fs.readFile(bible_directory + "\\bibles\\" + file, 'utf8', async function (err, data) {
            if (err) {
                return console.log(err);
            }
            let data_json = JSON.parse(data)
            let table_name = "bible_" + file.split(".json")[0];
            //await con.execute("DROP TABLE "+ table_name + ";", [])
            await con.execute("CREATE TABLE "+table_name+" (ID INT AUTO_INCREMENT PRIMARY KEY, book char(255), chapter int, verse int, content TEXT(2000));");
            for (const value of data_json.bible.book) {
                console.log(file.split(".json")[0], value.name[0])
                for (const value1 of value.chapter) {
                    for (const value2 of value1.verse) {
                        await con.execute("INSERT INTO " + table_name + " (book, chapter, verse, content) VALUES (?, ?, ?, ?);", [value.name[0], value1.name[0], value2.name[0], value2._]);
                    }
                }
            }
        });
    }
}

database_upload()
//process_references()
//get_bibles('C:\\Users\\thisi\\WebstormProjects\\untitled2\\bible-tools\\bible-translations')

