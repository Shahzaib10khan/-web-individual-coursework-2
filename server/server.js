const express = require("express");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.static("../client"))

app.get('/hello', (req, res) => res.send('hello'))

const Port = process.env.PORT || 5000;
const url = 'mongodb+srv://vue_rest_api:12345@cluster0.bifqg.mongodb.net/vueRestAPI?retryWrites=true&w=majority';

MongoClient.connect(url, function(err, client) {
    console.log('db connected!');
    db = client.db('vueRestAPI');

    app.post('/create-lesson', function (req, res) {
        // Sending request to create a data
        db.collection('lessons').insertOne(req.body, function (
          err,
          result
        ) {
          res.json(result)
        })
    });

    app.post('/create-order', function (req, res) {
        // Sending request to create a data
        db.collection('orders').insertOne(req.body, function (
          err,
          result
        ) {
          res.json(result)
        })
    });

    app.post('/search-lessons', function (req, res) {
      // return res.send(req.body)
        // Searching data in database
        db.collection('lessons').find({'course': {'$regex': req.body.keyword, '$options' : 'i'}}).toArray(function(err, result) {
          res.json(result)
        })
    });

    function createOrder(order){
      db.collection('orders').insertOne(order, function (
        err,
        result
      ) {
        console.log(result)
      })
    }

    app.get('/get-lessons', function (req, res) {
        // gretting data from server
        db.collection('lessons').find({}).toArray(function(err, result) {
          res.json(result)
        })
    });

    app.put('/update-lesson/:id', function (req, res) {
      const {course, thumbnail, description, city, price, space, reserved} = req.body;
      let updatedData = { $set: {space} }
        db.collection('lessons').findOneAndUpdate({_id : new mongodb.ObjectId(req.params.id)}, updatedData)
          .then(obj => {
            res.json(obj)
          })
    });

    app.put('/buy-lesson', function (req, res) {
      // return res.json(req.body.user)
        req.body.cart.forEach(data => {
          db.collection('lessons').findOne({_id : new mongodb.ObjectId(data._id)})
          .then(obj => {
            if (obj.space == 0) {
              db.collection('lessons').findOne({_id : new mongodb.ObjectId(data._id)})
              .then(obj => {
                res.json(obj)
              })
            }else{
              let updatedData = { $set: {space : obj.space-data.reserved} }
              db.collection('lessons').findOneAndUpdate({_id : new mongodb.ObjectId(data._id)}, updatedData)
              .then(obj => {
                let order = {
                  courseName: data.course,
                  full_name: req.body.user.full_name,
                  phone: req.body.user.phone,
                  quantity: data.reserved
                }
                createOrder(order);
                res.json(obj)
              })
            }
          })
        });
    });
})



app.listen(Port, () => console.log('Server is running...'))
