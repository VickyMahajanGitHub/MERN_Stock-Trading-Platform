require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { allHolding, allPositions, newOrder } = require("./controllers/trade");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());

//fetch all holdings from DB
app.use("/allHoldings", allHolding);
app.get("/allPositions", allPositions);
app.post("/newOrder", newOrder);

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

app.get("/", (req,res)  => {
  res.send("Welcome to the Stock Trading Platform API");
})

// Start the server only after connecting to the database then
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
