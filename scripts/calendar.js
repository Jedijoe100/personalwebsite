const {Calendar} = require("node-calendar-js");

async function generate_calendar(con, user_ID, month, year){
    let [user_events, field] = await con.execute('SELECT * FROM calendar_events WHERE user_ID = ? AND YEAR(event_date) = ? AND MONTH(event_date) = ?', [user_ID, year, month + 1])
    let calendar = new Calendar({
        year: year,
        month: month
    });
    let user_calendar = calendar.create();
    user_events.forEach(value => {
        user_calendar.days[user_calendar.days.findIndex(value_1 => {
            return value_1.day === value.event_date.getDate()
        })].events = [{name: value.event_name, time: value.event_time}]
    });
    return user_calendar
}

exports.calendar_load = async function (con, res, data, user_ID, query_value="") {
    let dt = new Date(Date.now());
    let month = dt.getMonth();
    let year = dt.getFullYear();
    res.render('calendar', {data: data, calendar: await generate_calendar(con, user_ID, month, year), query_value: query_value});
}
exports.month = async function (con, req, res, user_ID){
    let month = parseInt(req.body.month);
    let year = parseInt(req.body.year);
    res.render('templates/calendar_display', {calendar: await generate_calendar(con, user_ID, month, year)});
}
exports.add_event = async function (con, req, res, user_ID){
    let name = req.body.event_name;
    let date = req.body.event_date;//ensure that these values are cleaned before db
    let time = req.body.event_time;
    let month = parseInt(req.body.month);
    let year = parseInt(req.body.year);
    if(time !== undefined){
        await con.execute("INSERT INTO calendar_events (user_ID, event_date, event_name, event_time) VALUES (?, ?, ?, ?)", [user_ID, req.body.event_date, req.body.event_name, req.body.event_time]);
    }else{
        await con.execute("INSERT INTO calendar_events (user_ID, event_date, event_name) VALUES (?, ?, ?)", [user_ID, req.body.event_date, req.body.event_name]);
    }
    console.log(name, date, time);
    res.render('templates/calendar_display', {calendar: await generate_calendar(con, user_ID, month, year)});
}
