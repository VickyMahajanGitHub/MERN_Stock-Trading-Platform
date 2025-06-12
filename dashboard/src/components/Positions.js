import React, { useState, useEffect } from "react";
import axios from "axios";
import { positions } from "../data/data"; // useeffect hook to fetch data from api source of data will be from api
const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get("https://mern-stock-trading-platform.vercel.app/allPositions");
        console.log(response.data);
        setPositions(response.data);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to fetch positions. Please try again later.");
      }
    };

    fetchPositions();
  }, []);

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>

             { positions.map((stock,index) => {
                      const currValue= stock.price * stock.qty;
                      const isProfit=currValue-stock.avg*stock.qty >=0.0;
                      const profClass= isProfit ? "profit" : "loss";
                      const dayClass=stock.isLoss ? "loss" : "profit";
          
                      return (
                        <tr key={index} >
                      <td>{stock.product}</td>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{stock.avg.toFixed(2)}</td>
                      <td>{stock.price.toFixed(2)}</td>
          
                      <td className={profClass}>
                        {(currValue-stock.avg*stock.qty).toFixed(2)}{" "}
                      </td>
                     
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                      );
                    })}
          

        </table>
      </div>
    </>
  );
};

export default Positions;
