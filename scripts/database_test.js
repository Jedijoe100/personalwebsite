const mysql = require('mysql2/promise');

async function main() {
    let con = await mysql.createConnection({
        host: "127.0.0.1",
        user: "website_2",
        password: "J&/W^Y:yb@crhN/_W'?ec^>:XA?QJ&q-99X9B2)&6bWzNhxZs45C]ZyCL*9KqC}:]4[eXS&c4w9gh\"3\"DHy:c$Z}-2vGrCBsf}yppK52A983Rb\\HBEQ7D'w}n4Kd8:3bNaPenM4/&\\~\"%4?MZ22F-azQ2EB#k+.UmR.kcH$XxdmVTXE+nq.+TqZwND=69[>_~%!jHBd2@auz6KY;~`xSN6@c67HFhN{u)+:xZ9AGzQ?)\"d8r]/QpQS#J$.%=b,(y",
        database: "homewebsite"
        //multipleStatements: true
    });

    let test = await con.execute("SELECT * FROM tasks", [])
    console.log(test[0])
}


exports.main = main;
