const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  Collection,
  ObjectId,
} = require("mongodb");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://AbiAbdullah:DVtfnOuuFpubf71T@cluster0.l3iz1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("products").collection("items");

    const reviewsCollection = client.db("products").collection("review");

    // Get all Product items Collection
    app.get("/product", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const qurey = {};
      const cursor = productCollection.find(qurey);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    // Add Product
    app.post("/product", async (req, res) => {
      const qurey = req.body;
      const product = await productCollection.insertOne(qurey);
      res.send(product);
    });
    // Product Details
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const productId = await productCollection.findOne(qurey);
      res.send(productId);
    });

    // My Products Find Email Address

    app.get("/myProducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Product Count Pagination

    app.get("/productCount", async (req, res) => {
      const query = req.body;
      const cursor = productCollection.find(query);
      const count = await cursor.count();
      res.send({ count });
    });

    // Get All review All product
    app.get("/review", async (req, res) => {
      const qurey = {};
      const cursor = reviewsCollection.find(qurey);
      const review = await cursor.toArray();
      res.send(review);
    });
    // Add Reviews
    app.post("/review", async (req, res) => {
      const query = req.body;
      const review = await reviewsCollection.insertOne(query);
      res.send(review);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
