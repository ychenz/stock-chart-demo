import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

import LineChart from "src/components/LineChart";
import { TimeSeriesData } from "src/components/LineChart/types";
import { fetcher, HttpResponse } from "src/services/request";

import * as S from "./styles";
import DateRangeSelector from "../DateRangeSelector";
import { DateRanges } from "../DateRangeSelector/types";

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

const filterStockDataByDateRange = (stockDataList: TimeSeriesData[], dateRange: DateRanges): TimeSeriesData[] => {
    if (stockDataList.length === 0) {
      return [];
    }

    const latestTimestamp = stockDataList[0].timestamp;
    let msToSubtract: number;
    const msInADay = 86400000;
    let filteredStockData = stockDataList;

    switch (dateRange) {
      case DateRanges.FiveDays:
        msToSubtract = 5 * msInADay;
        break;
      case DateRanges.OneMonth:
        msToSubtract = 30 * msInADay;
        break;
      case DateRanges.SixMonths:
        msToSubtract = 180 * msInADay;
        break;
      case DateRanges.OneYear:
        msToSubtract = 365 * msInADay;
        break;
      case DateRanges.FiveYears:
        msToSubtract = 5 * 365 * msInADay;
        // Getting weekly data
        filteredStockData = getReducedStockData(stockDataList, 7);
        break;
      case DateRanges.TenYears:
        msToSubtract = 10 * 365 * msInADay;
        filteredStockData = getReducedStockData(stockDataList, 7);
        break;
      default:
    }

    return filteredStockData.filter(data => data.timestamp > latestTimestamp - msToSubtract);
  };

export function StockChartApp(): React.ReactElement {
  const [stockData, setStockData] = useState<TimeSeriesData[]>([]);
  const [dateRange, setDateRange] = useState<DateRanges>(DateRanges.TenYears);
  const prevDateRange = useRef(dateRange);

  useEffect(() => {
    async function asyncExecutor(): Promise<TimeSeriesData[]|undefined> {
      // Fetch 30 min interval data for shorter date range: 5D, 1M
      if (dateRange === DateRanges.FiveDays || dateRange === DateRanges.OneMonth) {
        const stockDataRes: HttpResponse<FMPStockData[]> = await fetcher<FMPStockData[]>({
          url: "https://financialmodelingprep.com/api/v3/historical-chart/30min/AAPL",
          method: "GET",
          queryParams: {
            apikey: FMP_API_KEY
          }
        });

        return stockDataRes.parsedBody && stockDataRes.parsedBody.map(entry => ({
          timestamp: moment(entry.date, "YYYY-MM-DD HH:mm:ss").valueOf(),
          value: entry.close
        }));
      }

      const stockDataRes: HttpResponse<FMPStockDataDaily> = await fetcher<FMPStockDataDaily>({
        url: "https://financialmodelingprep.com/api/v3/historical-price-full/AAPL",
        method: "GET",
        queryParams: {
          apikey: FMP_API_KEY,
          serietype: "line"
        }
      });

      // Taking max of 10 years of data
      return stockDataRes.parsedBody && stockDataRes.parsedBody.historical.slice(0, 3650).map(entry => ({
        timestamp: moment(entry.date, "YYYY-MM-DD").valueOf(),
        value: entry.close
      }));
    }

    console.log(prevDateRange);
    // Fetch 1 day interval data for longer date range
    asyncExecutor().then(res => res && setStockData(res));
  }, [dateRange]);

  const onDateRangeChange = (newDateRange: DateRanges) => {
    setDateRange(newDateRange);
  };

  return (
    <S.Root>
      {stockData.length > 0 && (
        <>
          <S.DateSelectorContainer>
            <DateRangeSelector dateRange={dateRange} onRangeSelected={onDateRangeChange} />
          </S.DateSelectorContainer>
          <LineChart
            timeSeriesDataLists={[filterStockDataByDateRange(stockData, dateRange).reverse()]}
          />
        </>
      )}
    </S.Root>
  );
}
