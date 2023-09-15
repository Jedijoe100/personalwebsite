const security = require("./security"), mysql = require('mysql2/promise'),
    temporary_storage = require('./temporary_storage');

exports.user_logged_on = async function(req, res, next, callback){
    if (req.session.loggedin) {
        let con = await mysql.createConnection(security.database_config);
        let user_ID = temporary_storage.users.filter(value => {
            return value.session_key === req.session.key
        })[0].id;
        await callback(con, user_ID);
        con.close();
    } else {
        res.redirect("/login")
    }
}

exports.groups_is_valid = async function(req, res, next, callback){
    exports.user_logged_on(req, res, next, async (con, user_ID) => {
        let group_id = req.query.id;
        if(group_id !== undefined){
            let [groups, fields1] = await con.execute("SELECT group_id FROM user_groups WHERE user_ID = ? AND group_ID = ?", [user_ID, group_id]);
            if (groups.length > 0){
                await callback(con, group_id)
            }else{
                await callback(con, user_ID)
            }
        }else{
            await callback(con, user_ID)
        }
    });
}
