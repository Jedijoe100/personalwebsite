const express = require('express'), scripture_scripts = require("../scripts/scripture"),
    general = require('../scripts/general_routing');
let router = express.Router();
const data = require('../data');

// Also will need to find Josh's German bible and potentially allow for german characters.
// Potentially to do this have a new section in the database called bibles.
// Then potentially allow for multiple bibles to be memorised at the same time.

router
    .get('/', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            await scripture_scripts.scripture_load(con, res, data, user_ID);
        });
    })
    .post('/attempt', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            await scripture_scripts.attempt(con, req, res, data, user_ID);
        });
    })
    .post('/update_list', async function (req, res, next) {
        await general.user_logged_on(req, res, next, async (con, user_ID) => {
            await scripture_scripts.update_list(con, req, res, data, user_ID);
        });
    })


module.exports = router;
