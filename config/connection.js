const express = require('express');
const path=require('path');
var mysql=require('mysql');
const bodyParser=require('body-parser');
var router = express.Router();

const app = express();
const port= process.env.PORT ||6000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var db;
var settings = {

    host:"127.0.0.1",
    user:"root",
    password:"mysql",
    database:"cs304projectdb"

};

function connectDatabase() {


        db = mysql.createConnection(settings);

        db.connect(function (err) {

            if(!err){
                console.log("Database connected");
            } else {

                console.log("Error database connection",err)
            }
        })
        return db;
    }


module.exports = connectDatabase();
