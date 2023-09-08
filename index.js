const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
    "mongodb+srv://database:tVNs5ygHmPOh9h4d@cluster0.prjizah.mongodb.net/?retryWrites=true&w=majority";
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
        await client.db("admin").command({ ping: 1 });
        console.log("connect-M");

        const menuCollection = client.db("bb-boss").collection("menu");
        const reviewsCollection = client.db("bb-boss").collection("reviews");
        const cartCollection = client.db("bb-boss").collection("carts");
        const userCollection = client.db("bb-boss").collection("users");

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            console.log("Existing user", existingUser);
            if (existingUser) {
                return res.send({ message: "USer Alrady Exist" });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        });
        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        });
        app.post("/carts", async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        });
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            console.log(email);
            if (!email) {
                res.send([]);
            } else {
                const query = { email: email };
                const result = await cartCollection.find(query).toArray();
                res.send(result);
            }
        });
        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("boss is on  sitting");
});

app.listen(port, () => {
    console.log(`${port}`);
});

/**
 *
 *
 *
 *
 */
