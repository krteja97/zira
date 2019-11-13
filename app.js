var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
const MongoStore = require('connect-mongo')(session); //this is for persistence

var loginRouter = require('./routes/login');
var complaintRouter = require('./routes/complaint');
var adminRouter = require('./routes/admin');

var app = express();



//setting up the connection to the database my way
var mongoose = require('mongoose');
const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'mydb';      // REPLACE WITH YOUR DB NAME

mongoose.connect(`mongodb://${server}/${database}`, {useNewUrlParser: true , useUnifiedTopology: true})
	.then(() => {
		console.log('database connected');
	})
	.catch(err => {
		console.error('database connection error');
	});
//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb connection error'));



//setting up session
app.use(session({
  secret: 'ilovedumbdogs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false ,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/user/', complaintRouter);
app.use('/admin', adminRouter);

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



module.exports = app;
