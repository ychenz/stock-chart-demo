import moment from "moment";
import { TimeSeriesData } from "../components/LineChart/types";
import { fetcher, HttpResponse } from "./request";
import { FMPCompanyProfileData, FMPStockData, FMPStockDataDaily } from "../components/StockChartApp/types";

const FMP_API_KEY = "demo";

export async function fetchStockData(): Promise<TimeSeriesData[]|undefined> {
      // Fetch AAPL stock data for longer period
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

export async function fetchShortTermStockData(): Promise<TimeSeriesData[]|undefined> {
  // Fetch 30 min interval data for shorter date range: 5D, 1M
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

export async function fetchCompanyProfile(): Promise<FMPCompanyProfileData|undefined> {
  const profileRes: HttpResponse<FMPCompanyProfileData[]> = await fetcher<FMPCompanyProfileData[]>({
    url: "https://financialmodelingprep.com/api/v3/profile/AAPL",
    method: "GET",
    queryParams: {
      apikey: FMP_API_KEY
    }
  });

  return profileRes.parsedBody && profileRes.parsedBody[0];
}