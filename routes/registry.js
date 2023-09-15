const express = require('express'), data = require('../data'), mysql = require('mysql2/promise'), security = require("../scripts/security");
var router = express.Router();

let render_registry = async function(req, res, next){
	let con = await mysql.createConnection(security.database_config);
	let [registry_info, field] = await con.execute("SELECT * FROM registry");
        res.render('registry', {"data": data, "info": registry_info});
	con.close();
}
let process_item_selected = async function(req, res, next){
	let con = await mysql.createConnection(security.database_config);
	let information = req.body.items.split(",");
	console.log(Date.now());
	for (const value of information){
		await con.execute("UPDATE registry SET isClaimed=TRUE, time=? WHERE Item = ?", [Date.now().toString(), value]);
	};
	res.send("Successful update");
}

router
    .get('/', function (req, res, next) {
        render_registry(req, res, next);
    })
    .post('/updateRegistry', function (req, res, next){
        process_item_selected(req, res, next);
    })

module.exports = router;
