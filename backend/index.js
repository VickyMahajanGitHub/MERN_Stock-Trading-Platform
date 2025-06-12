require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const cors = require("cors");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const app = express();
app.use(cors()); 
app.use(express.json()); 



//fetch all holdings from DB
app.get("/allHoldings", async (req, res) => {
  const holdings = await HoldingsModel.find({});
  res.status(200).json(holdings);
});

app.get("/allPositions", async (req, res) => {
  const positions = await PositionsModel.find({});
  res.status(200).json(positions);
});

// Add a new order

app.post("/newOrder", async (req, res) => {
  // console.log("REQ BODY:", req.body); // 👀 Debug
  // if (!req.body.name) {
  //   return res.status(400).json({ error: "Missing 'name' in body" });
  // }
  //   let newOrder = new OrdersModel({
  //     name: req.body.name,
  //     qty: req.body.qty,
  //     price: req.body.price,
  //     mode: req.body.mode,
  //   });
  //   await newOrder.save();
  //   res.status(200).send("Order added successfully");
  // });
  const { name, qty, price, mode } = req.body;

  try {
    // 1. Save order
    let newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();

    // 2. Update Holdings
    const existing = await HoldingsModel.findOne({ name });

    if (mode === "BUY") {
      if (existing) {
        const totalQty = existing.qty + qty;
        const totalCost = existing.avg * existing.qty + price * qty;
        const newAvg = totalCost / totalQty;

        existing.qty = totalQty;
        existing.avg = newAvg;
        existing.price = price; 
        await existing.save();
      } else {
        await HoldingsModel.create({ name, qty, avg: price, price });
      }
    } else if (mode === "SELL") {
      if (!existing || existing.qty < qty) {
        return res.status(400).json({ error: "Not enough quantity to sell" });
      }

      existing.qty -= qty;
      existing.price = price;

      if (existing.qty === 0) {
        await HoldingsModel.deleteOne({ name });
      } else {
        await existing.save();
      }
    }

    res.status(200).send("Order placed and holdings updated");
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Internal Server Error");
  }
});

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start the server only after connecting to the database .then

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
