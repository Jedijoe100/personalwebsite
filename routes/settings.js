const express = require('express'),
    security = require("../scripts/security"), mysql = require('mysql2/promise'),
    temporary_storage = require('../scripts/temporary_storage.js');
var router = express.Router();
const data = require('../data');


router
    .get('/', async function (req, res, next) {
        if (req.session.loggedin) {
            let con = await mysql.createConnection(security.database_config);
            let user = temporary_storage.users.filter(value => {
                console.log(req.session.key);
                return value.session_key === req.session.key
            })[0];
            let [news, fields1] = await con.execute("SELECT sources.ID AS source_ID, sources.src, sources.extra FROM user_choices INNER JOIN sources ON user_choices.source_ID = sources.ID AND sources.source_type LIKE 'news%' AND user_choices.user_ID = ?", [user.id])
            let [meme_sources, fields] = await con.execute("SELECT sources.ID AS source_ID, sources.extra FROM user_choices INNER JOIN sources ON user_choices.source_ID = sources.ID AND sources.source_type = 'memes' AND user_choices.user_ID = ?", [user.id])
            console.log(news)
            console.log(meme_sources)
            res.render('settings', {
                data: data,
                user: user,
                news_sources: news,
                meme_sources: meme_sources
            });
        } else {
            res.redirect("/login")
        }
    })

module.exports = router;
