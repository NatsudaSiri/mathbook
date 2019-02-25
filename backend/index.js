var express = require("express");
var bodyParser = require('body-parser');
const { user,time,subject,term} = require('./sequelize');

var cors = require('cors');
var session = require('express-session');
const app = express();

var defaultRoutes = require('./controllers/default')

var setting = require('./controllers/setting')
app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/', defaultRoutes)
app.use('/setting', setting)


app.listen(3000, function () {
  console.log('API LISTENNING ON PORT 3000')
})
