const express = require('express');
const path=require('path');
const bodyParser=require('body-parser');

var connection = require('./config/connection');

var index = require('./routes/index');
var users = require('./routes/users');
var suppliertransactions = require('./routes/suppliertransactions');
var router = express.Router();
const cors=require('cors');

const app = express();
const port= process.env.PORT ||5550;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(cors());
app.use('/users', users);
app.use('/suppliertransactions',suppliertransactions);
app.use('/',index);
app.listen(port);

//console.log('Magic happens on port ' + port);









module.exports = app;
