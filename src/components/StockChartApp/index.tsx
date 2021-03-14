import React, { useEffect, useState } from "react";
import moment from "moment";

import LineChart from "src/components/LineChart";
import { TimeSeriesData } from "src/components/LineChart/types";
import { Loader } from "src/components/Loader";

import { round } from "src/services/mathUtils";
import { fetchCompanyProfile, fetchShortTermStockData, fetchStockData } from "src/services/FMPRequests";
import ArrowDownIcon from "src/static/images/ArrowDown.svg";
import ArrowUpIcon from "src/static/images/ArrowUp.svg";

import * as S from "./styles";
import { FMPCompanyProfileData } from "./types";
import DateRangeSelector from "../DateRangeSelector";
import { DateRanges } from "../DateRangeSelector/types";

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
  const [shortTermStockData, setShortTermStockData] = useState<TimeSeriesData[]>([]);
  const [companyData, setCompanyData] = useState<FMPCompanyProfileData>();
  const [dateRange, setDateRange] = useState<DateRanges>(DateRanges.TenYears);

  useEffect(() => {
    fetchStockData().then(res => res && setStockData(res));
    fetchShortTermStockData().then(res => res && setShortTermStockData(res));
    fetchCompanyProfile().then(res => res && setCompanyData(res));
  }, []);

  const onDateRangeChange = (newDateRange: DateRanges) => {
    setDateRange(newDateRange);
  };

  const dataToUse = (
    dateRange === DateRanges.FiveDays || dateRange === DateRanges.OneMonth
  ) ? shortTermStockData : stockData;

  const renderCompanyProfile = (companyProfile: FMPCompanyProfileData) => {
    const { companyName, symbol, price, changes } = companyProfile;

    const currentDateTime = moment().format("MMM Do");
    const previousPrice = price - changes;
    const currentPrice = price;
    const priceChange = round(currentPrice - previousPrice, 2);
    const priceChangePercentage =round((currentPrice - previousPrice) * 100 / previousPrice, 2);

    return (
      <div>
        <S.HorizontalContainer>
          <S.CompanyNameText>{companyName}</S.CompanyNameText>
          <S.Ticker>{symbol}</S.Ticker>
        </S.HorizontalContainer>
        <S.Datetime>{currentDateTime}</S.Datetime>
        <S.HorizontalContainer>
          <S.CurrentPriceText>{`$${currentPrice}`}</S.CurrentPriceText>
          <S.PriceChange isNegative={priceChange < 0}>
            {priceChange > 0 ? `+${priceChange}` : priceChange}
          </S.PriceChange>
          {priceChangePercentage <= 0 ? (
            <S.ArrowIconContainer>
              <img src={ArrowDownIcon} alt="arrow-down" />
            </S.ArrowIconContainer>
          ) : (
            <S.ArrowIconContainer>
              <img src={ArrowUpIcon} alt="arrow-up" />
            </S.ArrowIconContainer>
          )}
          <S.PriceChange isNegative={priceChangePercentage < 0}>{`${priceChangePercentage}%`}</S.PriceChange>
        </S.HorizontalContainer>
      </div>
    );
  };

  return (
    <S.Root>
      {(stockData.length === 0 || !companyData) && (
        <Loader />
      )}

      {stockData.length > 0 && companyData && (
        <>
          {renderCompanyProfile(companyData)}
          <S.DateSelectorContainer>
            <DateRangeSelector dateRange={dateRange} onRangeSelected={onDateRangeChange} />
          </S.DateSelectorContainer>
          <LineChart
            dateRange={dateRange}
            timeSeriesDataLists={[filterStockDataByDateRange(dataToUse, dateRange).reverse()]}
          />
        </>
      )}
    </S.Root>
  );
}
