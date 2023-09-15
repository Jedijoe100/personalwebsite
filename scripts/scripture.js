const rwc = require("random-weighted-choice"), fs = require('fs');

let references;

fs.readFile('./data/bible_references/niv_ref.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    references = JSON.parse(data)
});

function join(total, value, index, array) {
    return total + " " + value
}

function hint_processing(data, verse, familiarity) {
    let hint = ""
    if (familiarity < data.scripture_constants.no_hint) {
        let values = verse.content.split(" ").map(value => {
            if (familiarity / 100 < Math.random()) {
                return value
            } else {
                return "_".repeat(value.length);
            }
        });
        if (values.length !== 0) {
            hint = values.reduce(join);
        }
    }
    return hint
}

function check_correct(data, content, actual) {
    let test_data = [encodeURI(content).toLowerCase(), encodeURI(actual).toLowerCase()]
    data.scripture_constants.ignore_characters.forEach(value => {
        test_data[0] = test_data[0].split(encodeURI(value)).join("")
        test_data[1] = test_data[1].split(encodeURI(value)).join("")
    })
    if (test_data[0] === test_data[1]) {
        return [true, data.scripture_constants.correct_change]
    } else {
        return [false, data.scripture_constants.incorrect_change]
    }
}

async function find_verse(con, bible, verse_id) {
    let verse_parts = verse_id.split(";");
    let [verse, field] = await con.execute("SELECT * FROM bible_" + bible + " WHERE book = ? AND chapter = ? AND verse = ?;", [verse_parts[0].replace("_", " "), verse_parts[1], verse_parts[2]]);
    return verse[0]
}

async function select_verse(user_ID, con, data) {
    let bible = "niv";
    let [verse_information, field] = await con.execute("SELECT * FROM verses WHERE user_ID = ?", [user_ID]);
    if (verse_information.length > 0) {
        let selected_verses = [];
        verse_information.forEach(value => {
            if (value.is_active) {
                selected_verses.push({
                    weight: 1/Math.exp(value.familiarity/100),
                    id: value.verse_ID
                });
            }
        });
        let selected_verse = rwc(selected_verses);
        let familiarity = verse_information.filter(value => {
            return value.verse_ID === selected_verse
        })[0].familiarity;
        let hint = "";
        let verse = {};
        if (familiarity > data.scripture_constants.paragraph) {
            let verse_parts = selected_verse.split(";");
            let extra_verses = Math.floor((familiarity - data.scripture_constants.paragraph) / data.scripture_constants.paragraph_verse_gradient + 1)
            let [verses, field] = await con.execute("SELECT * FROM bible_" + bible + " WHERE book = ? AND chapter = ? AND verse BETWEEN ? AND ?;", [verse_parts[0].replace("_", " "), verse_parts[1], parseInt(verse_parts[2]) - extra_verses, parseInt(verse_parts[2]) + extra_verses]);
            let content = "";
	    let title = verses[0].book + " " + verses[0].chapter + ":" + verses[0].verse + "-" + verses[verses.length - 1].verse;
	    hint += title+ " ";
            for (const value of verses) {
                let current_verse_parts = verse_parts[0] + ";" + verse_parts[1] + ";" + value.verse;
                let current_verse_information = verse_information.filter(value_1 => {
                    return value_1.verse_ID === current_verse_parts
                })[0];
                content += value.content + "\n";
                if (current_verse_information) {
                    hint += "~" + value.verse + "~ " + hint_processing(data, value, current_verse_information.familiarity - data.scripture_constants.paragraph_offset) + "<br>";
                } else {
                    hint += "~" + value.verse + "~ " + value.content + "<br>";
                    await con.execute("INSERT INTO verses (user_ID, verse_ID, familiarity, is_active, book, chapter, verse) VALUES (?, ?, 0, FALSE , ?, ?, ?)", [user_ID, current_verse_parts, value.book, value.chapter, value.verse])
                }
            }
            verse = {
                ID: verse_parts[0] + ";" + verse_parts[1] + ";" + verses[0].verse + "-" + verses[verses.length - 1].verse,
                verse: title,
                content: content,
                familiarity: familiarity
            }
        } else {
            let found_verse = await find_verse(con, bible, selected_verse);
	    let title = found_verse.book + " " + found_verse.chapter + ":" + found_verse.verse;
            verse = {
                ID: selected_verse,
                verse: title,
                content: found_verse.content,
                familiarity: familiarity
            }
	    hint += title + " ";
            hint += hint_processing(data, verse, familiarity);
        }
        return {hint, verse, verse_information}
    } else {
        return {}
    }
}

exports.scripture_load = async function (con, res, data, user_ID) {
    let information = await select_verse(user_ID, con, data);
    if (information.hint) {
        res.render('scripture_signin', {
            data: data,
            verse: information.verse.verse,
            verse_reference: information.verse.ID,
            familiarity: information.verse.familiarity,
            hint: information.hint,
            verses: references,
            user_information: information.verse_information,
            has_verse: true
        });
    } else {
        res.render('scripture_signin', {
            data: data,
            verse: "",
            verse_reference: "",
            familiarity: "",
            hint: "",
            verses: references,
            user_information: [],
            has_verse: false
        });
    }
}
exports.attempt = async function (con, req, res, data, user_ID) {
    let information = await select_verse(user_ID, con, data);
    let content = "";
    let success = false;
    let change_familiarity = data.scripture_constants.incorrect_change;
    if (req.body.reference.split("-").length === 1) {
        let relevant_verse = await find_verse(con, "niv", encodeURI(req.body.reference));
	content += relevant_verse.book + " " + relevant_verse.chapter + ":" + relevant_verse.verse + " ";
        content += relevant_verse.content;
        let verse_attempt = information.verse_information.filter(value => {
            return value.verse_ID === relevant_verse.book.replace(" ", "_") + ";" + relevant_verse.chapter + ";" + relevant_verse.verse
        })[0];
        [success, change_familiarity] = check_correct(data, content, req.body.input);
        change_familiarity += verse_attempt.familiarity;
        await con.execute("UPDATE verses SET familiarity = ? WHERE user_ID = ? AND verse_ID = ?", [change_familiarity, user_ID, verse_attempt.verse_ID])
    } else {
        let reference_part = req.body.reference.split(";")[0] + ";" + req.body.reference.split(";")[1] + ";"
        let verse_minimum = parseInt(req.body.reference.split(";")[2].split("-")[0])
        let verse_maximum = parseInt(req.body.reference.split("-")[1])
	content +=  req.body.reference.split(";")[0].replace("_", "_") + " " + req.body.reference.split(";")[1] + ":"+ verse_minimum + "-" + verse_maximum + " ";
        for (let i = verse_minimum; i < verse_maximum + 1; i++) {
            let relevant_verse = await find_verse(con, "niv", encodeURI(reference_part + i));
            content += relevant_verse.content + " ";
        }
        [success, change_familiarity] = check_correct(data, content, req.body.input);
        for (let i = verse_minimum; i < verse_maximum + 1; i++) {
            let relevant_verse = await find_verse(con, "niv", encodeURI(reference_part + i));
            let verse_attempt = information.verse_information.filter(value => {
                return value.verse_ID === relevant_verse.book.replace(" ", "_") + ";" + relevant_verse.chapter + ";" + relevant_verse.verse
            })[0];
            await con.execute("UPDATE verses SET familiarity = ? WHERE user_ID = ? AND verse_ID = ?", [change_familiarity + verse_attempt.familiarity, user_ID, verse_attempt.verse_ID])
        }
    }
    res.send(information.verse.ID + "/" + information.verse.verse + "/" + information.hint + "/" + information.verse.familiarity + "/" + success + "/" + content + "/" + req.body.input);
}
exports.update_list = async function (con, req, res, data, user_ID) {
    let [verse_information, field] = await con.execute("SELECT * FROM verses WHERE user_ID = ?", [user_ID]);
    let information = req.body.input.split(",").map(value => {
        return value
    });
    await con.execute("UPDATE verses SET is_active=FALSE WHERE user_ID = ?", [user_ID])
    for (const value of information) {
        let test_value = verse_information.filter(value1 => {
            return value1.verse_ID === value
        })[0];
        if (test_value) {
            await con.execute("UPDATE verses SET is_active=TRUE WHERE user_ID=? AND verse_ID=?", [user_ID, value])
        } else {
            let reference = value.split(";");
            await con.execute("INSERT INTO verses (user_ID, verse_ID, familiarity, is_active, book, chapter, verse) VALUES (?, ?, 0, TRUE, ?, ?, ?)", [user_ID, value, reference[0], parseInt(reference[1]), parseInt(reference[2])])
        }
    }
    res.send("Successful update")
}
