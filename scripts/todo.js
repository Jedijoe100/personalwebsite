exports.todo_load = async function (con, res, data, user_ID, query_value="") {
    let [tasks, fields1] = await con.execute("SELECT * FROM tasks WHERE user_ID=?", [user_ID])
    let [todo, fields2] = await con.execute("SELECT * FROM todo WHERE user_ID=?", [user_ID])
    res.render('todo', {data: data, tasks: tasks, todo: todo, query_value: query_value});
};
exports.update_task = async function (con, req, user_ID) {
    let data = {
        name: req.body.input.split("|")[0],
        time: parseFloat(req.body.input.split("|")[1])
    };
    if (parseFloat(req.body.input.split("|")[1])) {

    } else {
        data.time = 0;
    }
    await con.execute("UPDATE tasks SET time_spent=time_spent+? WHERE user_ID=? AND task=?", [data.time, user_ID, data.name]);
};
exports.add_task = async function (con, req, user_ID) {
    await con.execute("INSERT INTO tasks (user_ID, task, time_spent) VALUES (?, ?, ?)", [user_ID, req.body.input, 0]);
};
exports.delete_task = async function (con, req, user_ID) {
    await con.execute("DELETE FROM tasks WHERE user_ID=? AND task=?", [user_ID, req.body.input.split("_").join(" ")]);
};
exports.update_list = async function (con, req, user_ID) {
    let data = req.body.input.split("|||");
    for (const value of data) {
        await con.execute("DELETE FROM todo WHERE user_ID=? AND information=?", [user_ID, value.split("_").join(" ")])
    }
};
exports.add_todo = async function (con, req, user_ID) {
    await con.execute("INSERT INTO todo (user_ID, information) VALUES (?, ?)", [user_ID, req.body.input])
};

