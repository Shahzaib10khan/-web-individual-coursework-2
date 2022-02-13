const express = require("express");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors())

app.get('/hello', (req, res) => res.send('hello'))

const Port = process.env.PORT || 5000;
const url = 'mongodb+srv://vue_rest_api:12345@cluster0.bifqg.mongodb.net/vueRestAPI?retryWrites=true&w=majority';

MongoClient.connect(url, function(err, client) {
    console.log('db connected!');
    db = client.db('vueRestAPI');
})



app.listen(Port, () => console.log('Server is running...'))
