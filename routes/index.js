let express = require('express');
let router = express.Router();
const data = require('../data');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { data: data });
});

module.exports = router;
