const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dashboard_users:xAtXL7YorWWNJ72N@cluster0.ppw5mmu.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);


  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  async function run() {
    try {
        await client.connect();
        console.log('database connected')
        const dashboardCollection = client.db("dashboard").collection("users");
        const barsCollection = client.db("dashboard").collection("bars");

        app.put("/user/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await dashboardCollection.updateOne(filter, updateDoc, options);
            // const result = await dashboardCollection.insertOne(user) 
            res.send(result);
          });

          app.get('/user', async(req, res)=>{
            const users = await dashboardCollection.find().toArray();
            res.send(users);
          })
          // bars collection 
          app.get('/bar', async(req, res)=>{
            const bars = await barsCollection.find().toArray();
            res.send(bars);
          })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Running Dashboard Server");
});



app.listen(port, () => {
  console.log("Listing to port ", port);
});
