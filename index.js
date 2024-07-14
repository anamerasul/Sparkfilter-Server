const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yioatww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const clientOrderCollection = client.db("sparkfilterdb").collection("allOrder")
    const projectsCollection = client.db("sparkfilterdb").collection("allProject")
    const reviewsCollection = client.db("sparkfilterdb").collection("allReview")
    const adminCollection = client.db("sparkfilterdb").collection("admin")



    //  make admin api
    app.put('/admin', async (req, res) => {
      const user = req.body
      const query = { email: user?.email }
      const isExist = await adminCollection.findOne(query)
      if (isExist) {
        return res.send({ message: 'user already exists', insertedId: null })
      }

      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...user,
        }
      }
      const result = await adminCollection.updateOne(query, updateDoc, options)
      res.send((result))
    })

    app.get('/admin', async (req, res) => {
      const result = await adminCollection.find().toArray()
      res.send(result)
    })

    app.patch('/admin/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await adminCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })
    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email
      const result = await adminCollection.findOne({ email })
      res.send(result)
    })

    app.delete('/admins/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await adminCollection.deleteOne(query)
      res.send(result)
    })



    // client order api

    app.post('/order', async (req, res) => {
      const query = req.body
      const result = await clientOrderCollection.insertOne(query)
      res.send(result)
    })

    app.get('/order', async (req, res) => {
      const result = await clientOrderCollection.find().toArray()
      res.send(result)
    })
    app.get('/order/:id', async (req, res) => {
      const result = await clientOrderCollection.findOne()
      res.send(result)
    })
    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await clientOrderCollection.deleteOne(query)
      res.send(result)
    })


    // Project add api

    app.post('/project', async (req, res) => {
      const query = req.body
      const result = await projectsCollection.insertOne(query)
      res.send(result)
    })

    app.get('/project', async (req, res) => {
      const result = await projectsCollection.find().sort({ date: -1 }).toArray();
      res.send(result);
    });


    // Review add api 

    app.post('/review', async (req, res) => {
      const query = req.body
      const result = await reviewsCollection.insertOne(query)
      res.send(result)
    })

    app.get('/review', async (req, res) => {
      const result = await reviewsCollection.find().sort({ date: -1 }).toArray();
      res.send(result);
    });





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get('/', (req, res) => {
  res.send('SparkFilter is running on server')
})

app.listen(port, () => {
  console.log(`SparkFilter is running on Port: ${port}`)
})
