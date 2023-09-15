const express = require('express'), news = require('../scripts/news'), data = require('../data'), security = require("../scripts/security"), mysql = require('mysql2/promise'),
    temporary_storage = require('../scripts/temporary_storage.js');
var router = express.Router();

router.get('/', async function (req, res, next) {
    if (req.session.loggedin) {
        let con = await mysql.createConnection(security.database_config);
        let user_ID = temporary_storage.users.filter(value => {
            return value.session_key === req.session.key
        })[0];
        let user_news = await news.get_users_news(user_ID.id, con);
        res.render('news', {data: data, category: user_news});
        con.close();
    }else{
        res.redirect("/login");
    }
});

module.exports = router;
