'use strict';

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session  = require('express-session');
//var cookieSession = require('cookie-session');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var jcstore = require('./utils/jcstore')(session);

/*
let admin = require('firebase-admin');

let serviceAccount = require("./jewelchat-bfcb0-firebase-adminsdk-7yts9-ab89b3250c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jewelchat-bfcb0.firebaseio.com"
});

*/

var app = express();
app.disable('x-powered-by');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1)
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
  resave: false, 
  saveUninitialized: false,
  cookie: { maxAge: 6000000000000, httpOnly: false },
  store: new jcstore({}) })); 
//app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);


var passportUtil = require('./utils/passport');

passport.use(new LocalStrategy({
								  usernameField: 'userId',
								  passwordField: 'verificationCode',
								  passReqToCallback: true
								},
								passportUtil.authenticate));
passport.serializeUser(passportUtil.serializeUser);
passport.deserializeUser(passportUtil.deserializeUser);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err.message);
  res.json({error: true, message: err.message });
});

module.exports = app;
