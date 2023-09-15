const express = require('express'), todo_scripts = require("../scripts/todo"), calendar_scripts = require("../scripts/calendar"),
    general = require("../scripts/general_routing");
var router = express.Router();
const data = require('../data');


router
    .get('/', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            let [groups, fields1] = await con.execute("SELECT users.ID AS group_ID, users.username AS group_name FROM users INNER JOIN user_groups ON users.ID = user_groups.group_ID AND user_groups.user_ID = ?", [user_ID])
            res.render('groups', {
                data: data,
                groups: groups
            });
        })
    })
    .get('/todo', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            let group_id = req.query.id;
            let [groups, fields1] = await con.execute("SELECT users.ID AS group_ID, users.username AS group_name FROM users INNER JOIN user_groups ON users.ID = user_groups.group_ID AND user_groups.user_ID = ? AND user_groups.group_ID = ?", [user_ID, group_id]);
            if (groups.length > 0){
                const current_data = Object.assign({group_name: groups[0].group_name}, data);
                await todo_scripts.todo_load(con, res, current_data, group_id, "?id="+group_id);
            }else{
                res.redirect('/groups');
            }
        })
    })
    .get('/calendar', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            let group_id = req.query.id;
            let [groups, fields1] = await con.execute("SELECT users.ID AS group_ID, users.username AS group_name FROM users INNER JOIN user_groups ON users.ID = user_groups.group_ID AND user_groups.user_ID = ? AND user_groups.group_ID = ?", [user_ID, group_id]);
            if (groups.length > 0){
                const current_data = Object.assign({group_name: groups[0].group_name}, data);
                await calendar_scripts.calendar_load(con, res, current_data, group_id, "?id="+group_id);
            }else{
                res.redirect('/groups');
            }
        })
    })

module.exports = router;
