const express = require('express');
const security = require('../scripts/security.js');
const data = require('../data');
var router = express.Router();

router
    .get('/', function (req, res, next) {
        res.render('signin', {data: data});
    })
    .post('/', async function (req, res, next) {
        let key = await security.login(req.body.username, req.body.password);
        if(key){
            req.session.loggedin = true;
            req.session.key = key;
            res.redirect("/scripture");
        }else{
            res.send("Wrong password")
        }
    });


module.exports = router;
