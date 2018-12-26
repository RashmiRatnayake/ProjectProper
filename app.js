const express = require('express');
const path=require('path');

const bodyParser=require('body-parser');
const passport=require('passport');
let nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');


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
app.use('/notifications',notifications);
app.use('/',index);
app.listen(port);


//console.log('Magic happens on port ' + port);

    //job for due today....................................................................
   // const job = new CronJob('0 */1 0-24 * * *', function() {//for testing /sec,min,hrs,day(month),month,day(week)
    const job = new CronJob('0 0 */24 * * *', function() {//proper one
    const d = new Date();
   
    connection.query("select * from transactionrecord where duedate=DATE(?) AND (trnStatus='Unpaid' or trnStatus='partially paid') AND status>0",[d],function (err,results, fields) { 
     if(results){
          console.log("duetoday");
         // console.log(results);
        for (var result in results){
          //console.log(results[result]);

          var supplierid=results[result].supplier; 
          var dealerid=results[result].dealer;
          var suppliername;
          var dealername;
          var supplieremail;
          var dealeremail;
          //console.log(supplierid)
          connection.query("select businessName,contactEmail from userattributes where User_userid=?",[supplierid],function (err,supplier, fields) {
           if(supplier){
            suppliername=supplier[0].businessName;
            supplieremail=supplier[0].contactEmail;
            //console.log(suppliername);
            connection.query("select businessName,contactEmail from userattributes where User_userid=?",[dealerid],function (err,dealer, fields) {
              if(dealer){
            
              dealername=dealer[0].businessName;
              dealeremail=dealer[0].contactEmail;
              //console.log(dealername);

              const data = {
                notificationId:uuid,
                trnId:results[result].trnId,
                supplier:results[result].supplier,
                dealer:results[result].dealer,
                status:1,
                amountPending:results[result].amountPending,
                dateToday: d,
                due:"today",
                suppliername:suppliername,
                dealername:dealername
    
            };  
            console.log(data);

            // create mail transporter
            let transporter = nodemailer.createTransport(smtpTransport({
            service: "gmail",
            auth: {
             user: "creatoremail12345@gmail.com",
             pass: "creat123$"
             }
            }));

            let mailOptions = {
              from: "creatoremail12345@gmail.com",
              to: supplieremail,
              subject: ` Payment to be received today from `+dealername,
              text: `Hi `+suppliername+'! A payment of Rs.'+data.amountPending+' is due to be received from '+dealername+' today.'
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                throw error;
              } else {
                console.log("Email successfully sent!");
              }
            });

            let mailOptions2 = {
              from: "creatoremail12345@gmail.com",
              to: dealeremail,
              subject: ` Payment to be paid today to `+suppliername,
              text: `Hi `+dealername+'! A payment of Rs.'+data.amountPending+' is due to be paid to '+suppliername+'today.'
            };
            transporter.sendMail(mailOptions2, function(error, info) {
              if (error) {
                throw error;
              } else {
                console.log("Email successfully sent!");
              }
            });

            let sql = "INSERT INTO notification (notificationId,trnId,supplier,dealer,status,amountPending, dateToday, due,suppliername,dealername) values(?)"
            let vals = [data.notificationId,data.trnId,data.supplier,data.dealer,data.status,data.amountPending,data.dateToday,data.due,data.suppliername,data.dealername]
      
            connection.query(sql,[vals], function (err,result){
                  if(err){ 
                  }
                  else{
                    console.log("notification inserted");
              }
            });




              }
             });

           }
          });
          
          
         
          
        }

         
          
      } 
    });
	
});
job.start();

//.........................................................................................

//job for due in 3 daystime ....................................................................
    //const job2 = new CronJob('0 */1 0-24 * * *', function() {//for testing /sec,min,hrs,day(month),month,day(week)
    const job2 = new CronJob('0 1 */24 * * *', function() {//proper one
      const d = new Date();
     
      connection.query("select * from transactionrecord where duedate=DATE_ADD(DATE(?), INTERVAL 3 DAY) AND (trnStatus='Unpaid' or trnStatus='partially paid') AND status>0 ",[d],function (err,results, fields) { 
       if(results){
            console.log("due in 3 days");
           // console.log(results);
          for (var result in results){
            //console.log(results[result]);
  
            var supplierid=results[result].supplier; 
            var dealerid=results[result].dealer;
            var suppliername;
            var dealername;
            var supplieremail;
            var dealeremail;
            //console.log(supplierid)
            connection.query("select businessName,contactEmail from userattributes where User_userid=?",[supplierid],function (err,supplier, fields) {
             if(supplier){
              suppliername=supplier[0].businessName;
              supplieremail=supplier[0].contactEmail;
              //console.log(suppliername);
              connection.query("select businessName,contactEmail from userattributes where User_userid=?",[dealerid],function (err,dealer, fields) {
                if(dealer){
              
                dealername=dealer[0].businessName;
                dealeremail=dealer[0].contactEmail;
                //console.log(dealername);
  
                const data = {
                  notificationId:uuid,
                  trnId:results[result].trnId,
                  supplier:results[result].supplier,
                  dealer:results[result].dealer,
                  status:1,
                  amountPending:results[result].amountPending,
                  dateToday: d,
                  due:"in 3 days",
                  suppliername:suppliername,
                  dealername:dealername
      
              };  
              console.log(data);
  
              // create mail transporter
              let transporter = nodemailer.createTransport(smtpTransport({
              service: "gmail",
              auth: {
               user: "creatoremail12345@gmail.com",
               pass: "creat123$"
               }
              }));
  
              let mailOptions = {
                from: "creatoremail12345@gmail.com",
                to: supplieremail,
                subject: ` Payment to be received within 3 days from `+dealername,
                text: `Hi `+suppliername+'! A payment of Rs.'+data.amountPending+' is due to be received from '+dealername+' within 3 days.'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log("Email successfully sent!");
                }
              });
  
              let mailOptions2 = {
                from: "creatoremail12345@gmail.com",
                to: dealeremail,
                subject: ` Payment to be paid within 3 days to `+suppliername,
                text: `Hi `+dealername+'! A payment of Rs.'+data.amountPending+' is due to be paid to '+suppliername+'within 3 days.'
              };
              transporter.sendMail(mailOptions2, function(error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log("Email successfully sent!");
                }
              });
  
              let sql = "INSERT INTO notification (notificationId,trnId,supplier,dealer,status,amountPending, dateToday, due,suppliername,dealername) values(?)"
              let vals = [data.notificationId,data.trnId,data.supplier,data.dealer,data.status,data.amountPending,data.dateToday,data.due,data.suppliername,data.dealername]
        
              connection.query(sql,[vals], function (err,result){
                    if(err){ 
                    }
                    else{
                      console.log("notification inserted");
                }
              });
  
  
  
  
                }
               });
  
             }
            });
            
            
           
            
          }
  
           
            
        } 
      });
    
  });
  job2.start();
  
  //.........................................................................................


  //job for due in 3 daystime ....................................................................
   // const job3 = new CronJob('0 */1 0-24 * * *', function() {//for testing /sec,min,hrs,day(month),month,day(week)
    const job3 = new CronJob('0 2 */24 * * *', function() {//proper one
   const d = new Date();
     console.log("cronjob3")
      connection.query("select * from transactionrecord where duedate<(DATE(NOW())) AND (trnStatus='Unpaid' or trnStatus='partially paid') AND status>0 ",function (err,results, fields) { 
       if(results){
            console.log("due late");
           // console.log(results);
          for (var result in results){
            //console.log(results[result]);
  
            var supplierid=results[result].supplier; 
            var dealerid=results[result].dealer;
            var suppliername;
            var dealername;
            var supplieremail;
            var dealeremail;
            //console.log(supplierid)
            connection.query("select businessName,contactEmail from userattributes where User_userid=?",[supplierid],function (err,supplier, fields) {
             if(supplier){
              suppliername=supplier[0].businessName;
              supplieremail=supplier[0].contactEmail;
              //console.log(suppliername);
              connection.query("select businessName,contactEmail from userattributes where User_userid=?",[dealerid],function (err,dealer, fields) {
                if(dealer){
              
                dealername=dealer[0].businessName;
                dealeremail=dealer[0].contactEmail;
                //console.log(dealername);
  
                const data = {
                  dueDate:results[result].dueDate,
                  notificationId:uuid,
                  trnId:results[result].trnId,
                  supplier:results[result].supplier,
                  dealer:results[result].dealer,
                  status:1,
                  amountPending:results[result].amountPending,
                  dateToday: d,
                  due:"late",
                  suppliername:suppliername,
                  dealername:dealername
      
              };  
              console.log(data);
  
              // create mail transporter
              let transporter = nodemailer.createTransport(smtpTransport({
              service: "gmail",
              auth: {
               user: "creatoremail12345@gmail.com",
               pass: "creat123$"
               }
              }));
  
              let mailOptions = {
                from: "creatoremail12345@gmail.com",
                to: supplieremail,
                subject: ` Payment late from `+dealername,
                text: `Hi `+suppliername+'! A payment of Rs.'+data.amountPending+' is overdue and not yet received from '+dealername+'. The due date was' +data.dueDate 
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log("Email successfully sent!");
                }
              });
  
              let mailOptions2 = {
                from: "creatoremail12345@gmail.com",
                to: dealeremail,
                subject: ` Payment late to `+suppliername,
                text: `Hi `+dealername+'! A payment of Rs.'+data.amountPending+' is overdue and to be paid to '+suppliername+'. The due date was ' +data.dueDate 
              };
              transporter.sendMail(mailOptions2, function(error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log("Email successfully sent!");
                }
              });
  
              let sql = "INSERT INTO notification (notificationId,trnId,supplier,dealer,status,amountPending, dateToday, due,suppliername,dealername) values(?)"
              let vals = [data.notificationId,data.trnId,data.supplier,data.dealer,data.status,data.amountPending,data.dateToday,data.due,data.suppliername,data.dealername]
        
              connection.query(sql,[vals], function (err,result){
                    if(err){ 
                    }
                    else{
                      console.log("notification inserted");
                }
              });
  
  
  
  
                }
               });
  
             }
            });
            
            
           
            
          }
  
           
            
        } 
      });
    
  });
  job3.start();
  
  //.........................................................................................






module.exports = app;
