const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('bson');
require('dotenv').config()


const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
  res.send('Hello duniya!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9uobc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bookStore").collection("books");
  const ordersCollection = client.db("bookStore").collection("order");


  app.post('/addProduct', (req, res)=>{
      const books = req.body;
      console.log(books)
      booksCollection.insertOne(books)
      .then(result => {
          console.log(result)
          res.send('success')
      })
  })
  
  app.get('/products', (req, res)=>{
      booksCollection.find()
      .toArray((err, documents)=>{
          res.send(documents)
      })
  })

  app.get('/product/:productId',(req, res)=>{
    booksCollection.find({_id: ObjectId (req.params.productId)})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    booksCollection.deleteOne({_id: ObjectId (req.params.id)})
    .then((err, result) =>{
      console.log(result)
    })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    console.log(order)
    ordersCollection.insertOne(order)
    .then(result => {
        console.log(result)
        res.send('success')
    })
})

app.get('/orders', (req, res)=>{
  ordersCollection.find()
  .toArray((err, documents)=>{
      res.send(documents)
  })
})

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})