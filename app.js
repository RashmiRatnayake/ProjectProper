const express = require('express');
const path=require('path');

const bodyParser=require('body-parser');
const passport=require('passport');
let nodemailer = require("nodemailer");


var connection = require('./config/connection');
var uuid = require('./routes/uuid');

var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var transactions = require('./routes/transactions');
var posts = require('./routes/posts');
var circle = require('./routes/circle');
var news = require('./routes/news');
var messages = require('./routes/messages');
var userlist = require('./routes/userlist');
var notifications = require('./routes/notifications');
var router = express.Router();
const cors=require('cors');

const CronJob = require('./node_modules/cron/lib/cron.js').CronJob;

const app = express();
const port= process.env.PORT ||5550;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());



app.use(cors());
app.use('/users', users);
app.use('/profile', profile);
app.use('/transactions',transactions);
app.use('/posts',posts);
app.use('/circle',circle);
app.use('/news',news);
app.use('/messages',messages);
app.use('/userlist',userlist);
//app.use('/news',notifications);
app.use('/',index);
app.listen(port);


//console.log('Magic happens on port ' + port);
// create mail transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "creatoremail12345@gmail.com",
      pass: "creat123$"
    }
  });

    //const job = new CronJob('0 */1 12-22 * * *', function() {//for testing /sec,min,hrs,day(month),month,day(week)
    const job = new CronJob('0 0 */24 * * *', function() {//proper one
    const d = new Date();
   
    connection.query("select * from transactionrecord where duedate=DATE(?) ",[d],function (err,results, fields) { 
     if(results){
          console.log(results);
          let mailOptions = {
            from: "creatoremail12345@gmail.com",
            to: "rashmi1rathnayake@gmail.com",
            subject: `Not a GDPR update ;)`,
            text: `Hi there, this email was automatically sent by us`
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              throw error;
            } else {
              console.log("Email successfully sent!");
            }
          });
          //res.json({transaction:results});
      } 
    });
	
});
job.start();




module.exports = app;
