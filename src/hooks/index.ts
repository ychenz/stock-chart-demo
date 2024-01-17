import { useState, useEffect } from "react";
import { TimeSeriesData } from "src/components/LineChart/types";
import { FMPCompanyProfileData } from "src/components/StockChartApp/types";
import { fetchCompanyProfile, fetchShortTermStockData, fetchStockData } from "src/services/FMPRequests";

interface RequestCache {
    stockData: TimeSeriesData[];
    shortTermStockData: TimeSeriesData[];
    companyProfile: FMPCompanyProfileData | null;
}

const requestCache: RequestCache = {
    stockData: [],
    shortTermStockData: [],
    companyProfile: null
};

export const useStockData = (): TimeSeriesData[] => {
    const [stockData, setStockData] = useState<TimeSeriesData[]>([]);

    useEffect(() => {
        if (!requestCache.stockData.length) {
            fetchStockData().then(res => {
                if (res) {
                    setStockData(res);
                    requestCache.stockData = res;
                }
            });
        } else {
            setStockData(requestCache.stockData);
        }
    }, []);

    return stockData;
};

export const useShortTermStockData = (): TimeSeriesData[] => {
    const [shortTermStockData, setShortTermStockData] = useState<TimeSeriesData[]>([]);

    useEffect(() => {
        if (!requestCache.shortTermStockData.length) {
            fetchShortTermStockData().then(res => {
                if (res) {
                    setShortTermStockData(res);
                    requestCache.shortTermStockData = res;
                }
            });
        } else {
            setShortTermStockData(requestCache.shortTermStockData);
        }
    }, []);

    return shortTermStockData;
};

export const useCompanyProfile = (): FMPCompanyProfileData | null => {
    const [companyData, setCompanyData] = useState<FMPCompanyProfileData | null>(null);

    useEffect(() => {
        if (!requestCache.companyProfile) {
            fetchCompanyProfile().then(res => {
                if (res) {
                    setCompanyData(res);
                    requestCache.companyProfile = res;
                }
            });
        } else {
            setCompanyData(requestCache.companyProfile);
        }
    }, []);

    return companyData;
};
