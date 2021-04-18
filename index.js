const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6zppx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const servicesCollection = client.db("painter").collection("services");
  const bookingCollection = client.db("painter").collection("booking");
  const reviewCollection = client.db("painter").collection("review");

  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.get('/service/:id', (req, res) => {
    servicesCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addBooking', (req, res) => {
    const newOrder = req.body;
    bookingCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/bookingList', (req, res) => {
    bookingCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})