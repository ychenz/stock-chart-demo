import React from "react";

import { StockChartApp } from "./components/StockChartApp";
import "./App.css";

function App(): React.ReactElement {
  return (
    <div className="App">
      <div className="App-header">
        <StockChartApp />
      </div>
    </div>
  );
}

export default App;
