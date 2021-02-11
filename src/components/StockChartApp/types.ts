export interface FMPStockData {
  date: string;  // date in format YYYY-MM-DD HH:mm:ss
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export interface FMPStockDataDaily {
  symbol: string;
  historical: {
    date: string; // e.g: "2020-08-14"
    close: number;
  }[];
}

export interface FMPCompanyProfileData {
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