import React, { useEffect, useState } from "react";
import moment from "moment";

import LineChart from "src/components/LineChart";
import { TimeSeriesData } from "src/components/LineChart/types";
import { fetcher, HttpResponse } from "src/services/request";


import * as S from "./styles";

// const FMP_API_KEY = "68ea4a477785266e41b4ec5478fc6a1d";
const FMP_API_KEY = "demo";

interface FMPStockData {
  date: string;  // date in format YYYY-MM-DD HH:mm:ss
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

interface FMPStockDataDaily {
  symbol: string;
  historical: {
    date: string; // e.g: "2020-08-14"
    close: number;
  }[];
}

interface FMPCompanyProfileData {
  symbol: string;  // date in format YYYY-MM-DD HH:mm:ss
  price: number;
  companyName: string; // Apple Inc
  beta: number;
  volAvg: number;
  mktCap: string; // "1.37587904E12"
  lastDiv: number;
  range: string;
  changes:  number;
  changesPercentage: string; // "(+0.23)"
  exchange: string; // "Nasdaq Global Select"
  industry: string; // "Computer Hardware"
  website: string; // "http://www.apple.com"
  description: string;
  ceo: string;
  sector: string; // "Technology"
  image: string; // "https://financialmodelingprep.com/images-New-jpg/AAPL.jpg"
}

const getReducedStockData = (stockDataList: TimeSeriesData[], factor: number): TimeSeriesData[] => (
  // Retain 1 entry for every 7
  stockDataList.filter((data, i ) => i % factor === 0)
);

export function StockChartApp(): React.ReactElement {
  const [stockData, setStockData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    async function asyncExecutor(): Promise<HttpResponse<FMPStockDataDaily>> {
      const stockDataRes: HttpResponse<FMPStockDataDaily> = await fetcher<FMPStockDataDaily>({
        url: "https://financialmodelingprep.com/api/v3/historical-price-full/AAPL",
        method: "GET",
        queryParams: {
          apikey: FMP_API_KEY,
          serietype: "line"
        }
      });

      return stockDataRes;
    }

    // Fetch 1 day interval data for longer date range
    asyncExecutor().then(stockDataRes => stockDataRes.parsedBody && setStockData(
      // Taking max of 10 years of data
      getReducedStockData(stockDataRes.parsedBody.historical.slice(0, 3650).map((entry, i) => ({
        timestamp: moment(entry.date, "YYYY-MM-DD").valueOf(),
        value: entry.close
      })).reverse(), 10)
    ));
  }, []);

  return (
    <div>
      {stockData.length > 0 && <LineChart timeSeriesDataLists={[stockData]}/>}
    </div>
  );
}
