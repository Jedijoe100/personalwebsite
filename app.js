const createError = require('http-errors'), express = require('express'), path = require('path'),
    cookieParser = require('cookie-parser'), logger = require('morgan'),
    app = express(), port = 4000, session = require('express-session'),
    command_line = require('./scripts/command_line'), data = require('./data');
let Routers = [
    {name: "", router: require('./routes/index')},
    {name: "portfolio", router: require('./routes/portfolio')},
    {name: "registry", router: require('./routes/registry')},
    {name: "users", router: require('./routes/users')},
    {name: "scripture", router: require('./routes/scripture')},
    {name: "login", router: require('./routes/signin')},
    {name: "memes", router: require('./routes/memes')},
    {name: "grade_calculator", router: require('./routes/grade')},
    {name: "todo", router: require('./routes/todo')},
    {name: "settings", router: require('./routes/settings')},
    {name: "calendar", router: require('./routes/calendar')},
    {name: "groups", router: require('./routes/groups')},
    {name: "news", router: require('./routes/news')}
]
command_line.start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Routers.forEach(value => {
    app.use('/' + value.name, value.router)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {"data": data});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
