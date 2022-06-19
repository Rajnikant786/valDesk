require('dotenv').config() //import env file

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fileUpload = require('express-fileupload')

// =======middleware============
var flash = require('express-flash') // used as a middleware 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ===== session config =========
var session = require('express-session');

// import db
var connection = require('./app/config/DbConnection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var ejs = require('ejs')
var expressLayout = require('express-ejs-layouts')

// set template engine
app.use(expressLayout)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
  console.log("req.method :- "+req.method);
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  // console.log(req);
  next();
}) 


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session config
app.use(session({
  secret : process.env.COOKIE_SECRET,
  resave : false,
  // store : aytStore,
  saveUninitialized : false,
  cookie : { maxAge : 1000 * 60 * 60 * 24} // 24 hours
  //cookie : { maxAge : 1000 * 15 } // 15 seconds
}))   

app.use(flash())

app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(fileUpload());

// const PORT = process.env.SERVER_PORT || 3000
const PORT = process.env.SERVER_PORT; 

const server = app.listen(PORT , () => {
                  console.log(`Listening on port :- ${PORT}`)
                })



module.exports = app;
