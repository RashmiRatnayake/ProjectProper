const express = require('express');
const path=require('path');

const bodyParser=require('body-parser');
const passport=require('passport');


var connection = require('./config/connection');

var index = require('./routes/index');
var users = require('./routes/users');
//var profile = require('./routes/profile');
var transactions = require('./routes/transactions');
var posts = require('./routes/posts');
var router = express.Router();
const cors=require('cors');

const app = express();
const port= process.env.PORT ||5550;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());



app.use(cors());
app.use('/users', users);
//app.use('/profile', profile);
app.use('/transactions',transactions);
app.use('/posts',posts);
app.use('/',index);
app.listen(port);

//console.log('Magic happens on port ' + port);









module.exports = app;
