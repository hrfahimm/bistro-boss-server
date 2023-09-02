const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
   'mongodb+srv://database:tVNs5ygHmPOh9h4d@cluster0.prjizah.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});
async function run() {
   try {
      await client.connect();
      await client.db('admin').command({ ping: 1 });
      console.log('connect-M');

      const menuCollection = client.db('bb-boss').collection('menu');
      const reviewsCollection = client.db('bb-boss').collection('reviews');

      app.get('/menu', async (req, res) => {
         const result = await menuCollection.find().toArray();
         res.send(result);
      });
      app.get('/reviews', async (req, res) => {
         const result = await reviewsCollection.find().toArray();
         res.send(result);
      });
   } finally {
      //await client.close();
   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('boss is on  sitting');
});

app.listen(port, () => {
   console.log(`${port}`);
});
