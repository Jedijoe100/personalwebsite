const express = require('express'), calendar_scripts = require("../scripts/calendar"),
    general = require("../scripts/general_routing");

var router = express.Router();
const data = require('../data');


router
    .get('/', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID) => {
            await calendar_scripts.calendar_load(con, res, data, user_ID);
        })
    })
    .post('/month', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID)=>{
            await calendar_scripts.month(con, req, res, user_ID);
        })
    })
    .post('/add_event', async function (req, res, next) {
        await general.groups_is_valid(req, res, next, async (con, user_ID)=>{
            await calendar_scripts.add_event(con, req, res, user_ID);
        })
    })

module.exports = router;
