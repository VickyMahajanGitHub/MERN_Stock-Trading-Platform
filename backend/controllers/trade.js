import { HoldingsModel } from "../model/HoldingsModel.js";
import { OrdersModel } from "../model/OrdersModel.js";
import { PositionsModel } from "../model/PositionsModel.js";

export const allHolding = async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({});
    res.status(200).json(holdings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allPositions = async (req, res) => {
  try {
    const positions = await PositionsModel.find({});
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const newOrder = async (req, res) => {
 // console.log("REQ BODY:", req.body); 
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
}
