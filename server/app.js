var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
require('./config/passport')(passport); 



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: 'venky',
    resave: true,
    saveUninitialized: true
} )); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

app.use(function(req, res, next) {
    res.locals.currentUser = req.user; 
    res.locals.homeUrl = 'http://'+req.headers.host;
    next();
});

require('./routes/index.js')(app,passport);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 401);
  res.render('error');
});

module.exports = app;
app.listen('3000', function() {
    console.log('customer Record Portal at http://localhost:3000/!');
});
