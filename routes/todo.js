const express = require('express'), todo_scripts = require("../scripts/todo"),
    general = require("../scripts/general_routing");
let router = express.Router();
const data = require('../data');


router
    .get('/', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.todo_load(con, res, data, user_ID);
        })
    })
    .post('/update_task', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.update_task(con, req, user_ID);
            res.send("Successful update");
        })
    })
    .post('/add_task', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.add_task(con, req, user_ID);
            res.send("Successful update");
        })
    })
    .post('/delete_task', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.delete_task(con, req, user_ID);
            res.send("Successful update");
        })
    })
    .post('/update_list', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.update_list(con, req, user_ID);
            res.send("Successful update");
        })
    })
    .post('/add_todo', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await todo_scripts.add_todo(con, req, user_ID);
            res.send("Successful update");
        })
    })

module.exports = router;
