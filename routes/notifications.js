const express=require('express');
var app = express();
var mysql=require('mysql');
var connection = require('../config/connection');

const CronJob = require('../node_modules/cron/lib/cron.js').CronJob;



function sendNotifications() {
//console.log('Before job instantiation');
/* const job = new CronJob('0 /3 10-12 * * *', function() {
    const d = new Date();
    connection.query("select * from transactionrecord",function (err,results, fields) {
        if(results){
          console.log(results);
          //res.json({transaction:results});
      } 
    });
	//console.log('Every 30 minutes between 9-17:', d);
});
//console.log('After job instantiation');
job.start(); */
}

module.exports=sendNotifications();