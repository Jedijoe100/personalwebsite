const express = require('express');
const data = require('../data');
var router = express.Router();

router
    .get('/', function (req, res, next) {
        res.render('portfolio', {"data": data});
    })

module.exports = router;
