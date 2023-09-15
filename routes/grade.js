const express = require('express');
const data = require('../data');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('grade_calculator', {data: data});
})

module.exports = router;
