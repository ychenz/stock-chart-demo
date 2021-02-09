import styled from "styled-components";
import { cssColors, cssVariables } from "src/styles/css";
import { CHART_HEIGHT, Y_LABEL_COUNT, X_LABEL_COUNT, MIN_CHART_WIDTH } from "./constants";

const Y_LABEL_WIDTH = 40;
export const Root = styled.div`
  position: relative;
  width: calc(100% - ${Y_LABEL_WIDTH}px);
  padding-left: ${Y_LABEL_WIDTH}px; // leaving space for Y labels
  min-width: ${MIN_CHART_WIDTH}px;
  margin-top: 40px;
`;

export const LineChartFrame = styled.div`
  position: relative;
  height: ${CHART_HEIGHT}px;
  border-left: 1px solid ${cssColors.colorBlack};
  border-bottom: 1px solid ${cssColors.colorBlack};
`;

// ColumnsContainer make sure columns are displayed horizontally
export const ColumnsContainer = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
`;

const firstLineMarginTop = 12;
const yLineDistance = (CHART_HEIGHT - firstLineMarginTop) / (Y_LABEL_COUNT - 1);
export const FrameBackgroundGridLine = styled.div<{ count: number }>`
  position: absolute;
  width: 100%;
  left: 0;
  top: calc(${firstLineMarginTop}px + ${({ count }) => count * yLineDistance }px);
  border-top: 1px solid ${cssColors.colorGray5};
  z-index: 1;
`;

export const LineChartGraphContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export const YLabelsContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const yLabelsFontHeight = 19;
const yLabelsDistance = (CHART_HEIGHT - Y_LABEL_COUNT * yLabelsFontHeight) / (Y_LABEL_COUNT - 1);
export const YLabelsText = styled.div<{ count: number }>`
  margin-top: ${({ count }) => count === 0 ? 0 : yLabelsDistance}px;
  font-family: ${cssVariables.titleFontFamily};
  font-size: ${cssVariables.smallFontSize};
  line-height: ${yLabelsFontHeight}px;
  color: ${cssColors.colorGray5};
`;

export const XLabelContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: ${cssVariables.uiUnit};
`;

export const XLabelsText = styled.div`
  width: calc(100%/${X_LABEL_COUNT});
  text-align: center;
  font-family: ${cssVariables.titleFontFamily};
  font-size: ${cssVariables.largeFontSize};
  line-height: 25px;
  color: ${cssColors.colorGray6};
`;

// columns contain data points. Points lights up if user hover on columns
export const Column = styled.div<{ count: number;isActive: boolean|null }>`
  position: relative;
  width: ${({ count }) => `calc(100%/${count})`};
  cursor: pointer;
  border-right: ${({ isActive }) => isActive ? `1px dashed ${cssColors.colorGray4}` : "none"};
  
  &:active {
    border-right: 1px dashed ${cssColors.colorGray4};
  }
  
  &:hover {
    border-right: 1px dashed ${cssColors.colorGray4};
  }
`;

export const DataPoint = styled.div<{ isBad: boolean }>`
  display: none;
  position: absolute;
  right: -6px;  // we need -6px to move the point to the center, as diameter of the point is 12px (10 + 2 border)
  height: 10px;
  width: 10px;
  border: 1px solid ${cssColors.colorWhite};
  border-radius: 50%;
  background-color: ${({ isBad }) => isBad ? cssColors.colorBloodRed : cssColors.colorDarkSoftGreen};
  
  ${Column}:hover & {
    display: initial;
  }
  
  ${Column}:active & {
    display: initial;
  }
`;

export const TooltipContainer = styled.div<{ isInverted: boolean }>`
  position: fixed; // x, y location value is relative to the browser window, so using fixed
  background-color: ${cssColors.colorGray4};
  border-radius: ${cssVariables.smallBorderRadius};
  padding: ${cssVariables.uiUnit};
  z-index: 10;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  transition: transform 50ms ease;
  pointer-events: none;  // NOTE: this is REQUIRED for the transform to work
  white-space: nowrap;  // Prevent all containing text from wrapping
  
  ${({ isInverted }) => isInverted && `
    transform: translateX(calc(-100% - 24px));
  `}
`;

export const TooltipMultiColorIndicator = styled.div`
  height: 6px;
  width: 6px;
  margin-right: ${cssVariables.uiUnit};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  filter: blur(2px);
  border-radius: 2px;
`;

export const TooltipEntryContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${cssVariables.uiUnitHalf};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TooltipValueText = styled.div`
  color: ${cssColors.colorWhite};
  font-family: ${cssVariables.titleFontFamily};
  font-weight: ${cssVariables.heavyFontWeight};
  font-size: ${cssVariables.smallFontSize};
  line-height: 20px;
`;

export const TooltipDateText = styled.div`
  margin-left: ${cssVariables.uiUnitDouble};
  color: ${cssColors.colorWhite};
  font-family: ${cssVariables.titleFontFamily};
  font-size: ${cssVariables.smallFontSize};
  line-height: 20px;
`;

export const TooltipPercentageChange = styled.div<{ isBad: boolean }>`
  display: flex;
  align-items: center;
  margin-right: ${cssVariables.uiUnit};
  color: ${({ isBad }) => isBad ? cssColors.colorBloodRed : cssColors.colorDarkSoftGreen};
  font-family: ${cssVariables.titleFontFamily};
  font-weight: ${cssVariables.mediumFontWeight};
  font-size: ${cssVariables.smallFontSize};
  line-height: 20px;
`;

export const TooltipPercentageChangeIcon = styled.div`
  margin-right: ${cssVariables.uiUnitHalf};
  height: 20px;
`;

export const ArrowIconContainer = styled.div`
  width: 12px;
  height: 12px;
`;
