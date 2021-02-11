import styled from "styled-components";
import { cssColors, cssVariables } from "../../styles/css";

const StockChartApp = styled.div`
  position: relative;
`;

export const Root = StockChartApp;

export const DateSelectorContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const HorizontalContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const CompanyNameText = styled.div`
  font-size: ${cssVariables.largeFontSize};
  font-weight: ${cssVariables.heavyFontWeight};
  line-height: 20px;
  color: ${cssColors.colorBlack};
  font-family: ${cssVariables.titleFontFamily};
  margin-right: ${cssVariables.uiUnit};
`;

export const Ticker = styled.div`
  font-size: ${cssVariables.smallFontSize};
  line-height: 16px;
  color: ${cssColors.colorGray5};
  font-family: ${cssVariables.contentFontFamily};
`;

export const Datetime = styled.div`
  text-align: left;
  font-size: ${cssVariables.xSmallFontSize};
  line-height: 10px;
  color: ${cssColors.colorGray5};
  font-family: ${cssVariables.titleFontFamily};
  margin: ${cssVariables.uiUnitHalf} 0;
`;

export const CurrentPriceText = styled.div`
  font-size: ${cssVariables.smallFontSize};
  line-height: 16px;
  color: black;
  font-family: ${cssVariables.contentFontFamily};
  margin-right: ${cssVariables.uiUnit};
`;

export const PriceChange = styled.div<{ isNegative: boolean }>`
  font-size: ${cssVariables.smallFontSize};
  font-weight: ${cssVariables.mediumFontWeight};
  line-height: 16px;
  color: ${p=> p.isNegative ? cssColors.colorBloodRed : cssColors.colorSoftGreen};
  font-family: ${cssVariables.titleFontFamily};
  margin-right: ${cssVariables.uiUnit};
`;

export const ArrowIconContainer = styled.div`
  height: ${cssVariables.uiUnit};
  width: ${cssVariables.uiUnit};
  margin-right: ${cssVariables.uiUnitHalf};
  display: flex;
  align-items: center;
`;
