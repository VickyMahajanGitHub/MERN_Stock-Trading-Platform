import React, { useState, useEffect, useContext } from "react";
import { VerticalGraph } from './VerticalGraph';
import GeneralContext from "./GeneralContext";
import axios from "axios";
import { BASE_URL } from "../api/client";


// import { holdings } from "../data/data"; // Static data import (could be replaced with API using useEffect)
const Holdings = () => {
  // State to hold the holdings data
  const [holdings, setHoldings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/allHoldings`);
        // console.log(response.data);
        setHoldings(response.data); // Set data with API Data
      } catch (err) {
        console.error("Error fetching holdings:", err);
        setError("Failed to fetch holdings. Please try again later.");
      }
    };

    fetchHoldings();
  }, []);


  const labels= holdings.map((subArray) => subArray.name);
  const data ={
    labels,
    datasets: [
      {
        label: 'Stock Price',
        data: holdings.map((stock) => stock.price),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  }

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {holdings.map((stock, index) => {
            const currValue = stock.price * stock.qty;
            const isProfit = currValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{currValue.toFixed(2)}</td>
                <td className={profClass}>
                  {(currValue - stock.avg * stock.qty).toFixed(2)}{" "}
                </td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
