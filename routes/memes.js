const express = require('express'), memes = require('../scripts/memes'), data = require('../data'),
    security = require("../scripts/security"), mysql = require('mysql2/promise'),
    temporary_storage = require('../scripts/temporary_storage.js');
var router = express.Router();

router.get('/', async function (req, res, next) {
    if (req.session.loggedin) {
        let con = await mysql.createConnection(security.database_config);
        let user_ID = temporary_storage.users.filter(value => {
            return value.session_key === req.session.key
        })[0];
        let user_memes = await memes.get_user_memes(user_ID.id, con);
        res.render('memes', {data: data, memes: user_memes});
        con.close();
    }else{
        res.redirect("/login");
    }
});

module.exports = router;
