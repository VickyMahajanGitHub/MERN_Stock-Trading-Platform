// import React, { useState,useContext } from "react";
// import { Link } from "react-router-dom";

// import axios from "axios";

// import GeneralContext from "./GeneralContext";

// import "./BuyActionWindow.css";

// const BuyActionWindow = ({ uid,mode="BUY" }) => {
//   const [stockQuantity, setStockQuantity] = useState(1);
//   const [stockPrice, setStockPrice] = useState(0.0);
//   const ctx = useContext(GeneralContext); // <-- for context functions

//   const handleActionClick=() => {
//     axios.post("https://mern-stock-trading-platform.vercel.app/newOrder", {
//       name: uid,
//       qty: stockQuantity,
//       price: stockPrice,
//       mode: mode,
//     })
//     ctx.refreshHoldings(); // 🔁 Refresh Holdings after Buy/Sell
//     ctx.closeBuyWindow(); // closing window
//   };

//   const handleCancelClick = () => {
//     ctx.closeBuyWindow();
//   };

//   return (
//     <div className="container" id="buy-window" draggable="true">
//       <div className="regular-order">
//         <div className="inputs">
//           <fieldset>
//             <legend>Qty.</legend>
//             <input
//               type="number"
//               name="qty"
//               id="qty"
//               onChange={(e) => setStockQuantity(e.target.value)}
//               value={stockQuantity}
//             />
//           </fieldset>
//           <fieldset>
//             <legend>Price</legend>
//             <input
//               type="number"
//               name="price"
//               id="price"
//               step="0.05"
//               onChange={(e) => setStockPrice(e.target.value)}
//               value={stockPrice}
//             />
//           </fieldset>
//         </div>
//       </div>

//       <div className="buttons">
//         <span>Margin required ₹140.65</span>
//         <div>
//           {/* <Link className="btn btn-blue" onClick={handleSubmitClick}>
//             Buy
//           </Link> */}
//            <Link className={mode === "BUY" ? "btn btn-blue" : " btn btn-red"} onClick={handleActionClick}>
//             {mode === "BUY" ? "Buy" : "Sell"}
//           </Link>
//           <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
//             Cancel
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuyActionWindow;

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY" }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const ctx = useContext(GeneralContext);

  useEffect(() => {
    if (!uid || ctx.holdings.length === 0) return;

    console.log("Holdings:", ctx.holdings);
    console.log("UID:", uid);

    const stock = ctx.holdings.find((s) => s.name?.trim() === uid.trim());
    console.log("Auto-fill match found:", stock);

    if (stock) {
      setStockQuantity(stock.qty);
      setStockPrice(stock.price);
    }
  }, [uid, ctx.holdings]);

  const handleActionClick = async () => {
    try {
      await axios.post("https://mern-stock-trading-platform.vercel.app/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: mode,
      });
      toast.success(`${mode} order successful`);
      ctx.refreshHoldings();
      ctx.closeBuyWindow();
    } catch (error) {
      toast.error(`${mode} order failed`);
    }
  };

  const handleUpdateClick = async () => {
    try {
      await axios.put("https://mern-stock-trading-platform.vercel.app/updateHolding", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
      });
      toast.success("Holding updated");
      ctx.refreshHoldings();
      ctx.closeBuyWindow();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm(`Are you sure you want to delete ${uid}?`)) return;
    try {
      await axios.delete("https://mern-stock-trading-platform.vercel.app/deleteHolding", {
        data: { name: uid },
      });
      toast.success("Holding deleted");
      ctx.refreshHoldings();
      ctx.closeBuyWindow();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleCancelClick = () => {
    ctx.closeBuyWindow();
  };

  const stockExists = ctx.holdings.some((s) => s.name?.trim() === uid.trim());

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />{" "}
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link
            className={mode === "BUY" ? "btn btn-blue" : "btn btn-red"}
            onClick={handleActionClick}
          >
            {mode === "BUY" ? "Buy" : "Sell"}
          </Link>
          {stockExists && (
            <>
              <Link className="btn btn-yellow" onClick={handleUpdateClick}>
                Update
              </Link>
              <Link className="btn btn-red" onClick={handleDeleteClick}>
                Delete
              </Link>
            </>
          )}
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
