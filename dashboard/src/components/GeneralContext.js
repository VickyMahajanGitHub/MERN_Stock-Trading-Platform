import React, { useState, useEffect } from "react";
import BuyActionWindow from "./BuyActionWindow";

const axios = require("axios");
const GeneralContext = React.createContext({
  openBuyWindow: (uid, mode) => {},
  closeBuyWindow: () => {},
  holdings: [],
  refreshHoldings: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [tradeMode, setTradeMode] = useState("BUY"); // BUY or SELL
  const [holdings, setHoldings] = useState([]);

    const fetchHoldings = async () => {
    try {
      const response = await axios.get("http://localhost:3002/allHoldings");
      setHoldings(response.data);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleOpenBuyWindow = (uid, mode="BUY") => {
    setSelectedStockUID(uid);
    setTradeMode(mode);
    setIsBuyWindowOpen(true);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setTradeMode("BUY");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        holdings,
        refreshHoldings: fetchHoldings, // Function to refresh holdings
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow uid={selectedStockUID} mode={tradeMode}  onTradeComplete={fetchHoldings}/>
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
