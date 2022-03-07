const express = require('express')
const app = express()
require('dotenv').config()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const MongoClient = require('mongodb').MongoClient
const { sendInvite } = require('./lib.js')

app.use(express.static('public'))

app.post('/submitForm', jsonParser, function (req, res) {
    console.log(req.body)
    MongoClient.connect(process.env.MONGO_URI, function(err, db) {
        
        if (err) throw err;
        var dbObj = db.db('Invitation')
        var formData = { email: req.body.email, dateSelected: req.body.dateSel}
        dbObj.collection("responses").insertOne(formData, function(err, response) {
            if (err) throw err;
            console.log("Successfully inserted");
            res.status(200).send("success")
            db.close();
        })
    })
    sendInvite(req.body)
})

app.listen(3000, () => {
    console.log('runnning on 3000')
})