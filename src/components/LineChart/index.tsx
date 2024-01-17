import React, { ReactElement } from "react";
import moment from "moment";
import { round } from "src/services/mathUtils";
import ArrowUpIcon from "src/static/images/ArrowUp.svg";
import ArrowDownIcon from "src/static/images/ArrowDown.svg";
import { CHART_HEIGHT, diagramColors, X_LABEL_COUNT, Y_LABEL_COUNT } from "./constants";
import LineChartGraph from "./LineChartGraph";

import {
  ArrowIconContainer,
  Column,
  ColumnsContainer,
  DataPoint,
  FrameBackgroundGridLine,
  LineChartFrame,
  LineChartGraphContainer,
  Root,
  TooltipContainer,
  TooltipDateText,
  TooltipEntryContainer,
  TooltipMultiColorIndicator,
  TooltipPercentageChange,
  TooltipPercentageChangeIcon,
  TooltipValueText,
  XLabelContainer,
  XLabelsText,
  YLabelsContainer,
  YLabelsText
} from "./styles";
import { TimeSeriesData } from "./types";
import { DateRanges } from "../DateRangeSelector/types";

interface TooltipsConfig {
  x: number;
  y: number | null;
  isInverted: boolean;
  mouseIsDown: boolean;
  startColumnIndex: number;
  endColumnIndex: number | null;
}

interface LineChartState {
  tooltipData: {
    startData: TimeSeriesData[]; // columns data, length is the same as timeSeriesDataLists, contains only data for that index
    endData: TimeSeriesData[] | null; // Same as above, should have same length as timeSeriesDataLists
    config: TooltipsConfig;
  } | null;
}

interface LineChartProps {
  dateRange: DateRanges;
  timeSeriesDataLists: TimeSeriesData[][];
}

class LineChart extends React.PureComponent<LineChartProps, LineChartState> {
  static isTooltipPriceDropping(
    startValue: number,
    startColIndex: number,
    endValue: number,
    endColIndex: number,
  ): boolean {
    if (startColIndex < endColIndex) {
      return endValue <= startValue;
    }

    return endValue > startValue;
  }

  static isDropping(timeSeriesDataList: TimeSeriesData[]): boolean {
    return timeSeriesDataList[0].value >= timeSeriesDataList[timeSeriesDataList.length - 1].value;
  }

  state: LineChartState = {
    tooltipData: null
  }

  handleColumnMouseLeaveBound = this.handleColumnMouseLeave.bind(this);
  handleColumnMouseMoveBound = this.handleColumnMouseMove.bind(this);
  handleColumnMouseDownBound = this.handleColumnMouseDown.bind(this);
  handleColumnMouseUpBound = this.handleColumnMouseUp.bind(this);

  handleColumnMouseEnter(event: React.MouseEvent<HTMLDivElement>, columnData: TimeSeriesData[], columnIndex: number): void {
    const { tooltipData } = this.state;

    const target = event.target as HTMLDivElement;
    const targetBoundingClientRect = target.getBoundingClientRect();
    const x = targetBoundingClientRect.right + 12; // tooltip is shown on the right of the vertical line (right border)
    const isInverted = x > window.innerWidth - 200; // Display tooltip on the other side of the line if its out of window
    let config: TooltipsConfig = {
      isInverted,
      x,
      y: null,
      mouseIsDown: false,
      startColumnIndex: columnIndex,
      endColumnIndex: null
    };

    let startTooltipsData: TimeSeriesData[] = columnData;
    let endTooltipsData = null;

    // Update end column if user is dragging on the chart (mouse is pressed down)
    if (tooltipData && tooltipData.config && tooltipData.config.mouseIsDown) {
      startTooltipsData = tooltipData.startData;
      endTooltipsData = columnData;
      config = {
        ...config,
        mouseIsDown: tooltipData.config.mouseIsDown,
        startColumnIndex: tooltipData.config.startColumnIndex,
        endColumnIndex: columnIndex
      };
    }

    this.setState({
      tooltipData: {
        startData: startTooltipsData,
        endData: endTooltipsData,
        config
      }
    });
  }

  handleColumnMouseMove(event: React.MouseEvent): void {
    const { clientY } = event;
    const { tooltipData } = this.state;

    if (tooltipData) {
      this.setState(prevState => prevState.tooltipData && ({
        tooltipData: {
          ...prevState.tooltipData,
          config: {
            ...prevState.tooltipData.config,
            y: clientY
          }
        }
      }));
    }
  }

  handleColumnMouseLeave(): void {
    this.setState({
      tooltipData: null
    });
  }

  handleColumnMouseDown(columnData: TimeSeriesData[], columnIndex: number): void {
    this.setState(prevState => prevState.tooltipData && ({
      tooltipData: {
        startData: prevState.tooltipData.startData,
        endData: columnData,
        config: {
          ...prevState.tooltipData.config,
          endColumnIndex: columnIndex,
          mouseIsDown: true
        }
      }
    }));
  }

  handleColumnMouseUp(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setState(prevState => prevState.tooltipData && ({
      tooltipData: {
        startData: prevState.tooltipData.endData,
        endData: null,
        config: {
          ...prevState.tooltipData.config,
          endColumnIndex: null,
          startColumnIndex: prevState.tooltipData.config.endColumnIndex,
          mouseIsDown: false
        }
      }
    }));
  }

  get xLabels(): string[] {
    const { timeSeriesDataLists } = this.props;
    // timestamp should be same for all dataset, we just take the 1st one here is sufficient
    const dataList1 = timeSeriesDataLists[0];

    const endTimestamp = dataList1[0].timestamp;
    const startTimestamp = dataList1[dataList1.length - 1].timestamp;
    const duration = endTimestamp - startTimestamp;

    // we label X in the middle, so margin 1/2 of the in-between distance to the start and end, distance between labels
    // are as usual
    const timeSegment = duration / (X_LABEL_COUNT * 2);

    // From left (earlier) to right (later)
    return [...Array(X_LABEL_COUNT).keys()].map(
      i => moment(endTimestamp - timeSegment - i * 2 * timeSegment).format("MMM D, YYYY")
    );
  }

  get yLabels(): string[] {
    const { timeSeriesDataLists } = this.props;
    // Combine all data to get the true max/min values
    const datalist = timeSeriesDataLists.reduce((list1, list2) => list1.concat(list2));

    const maxValue = Math.max(...datalist.map(data => data.value));
    const minValue = Math.min(...datalist.map(data => data.value));
    let maxLabel = Math.ceil(maxValue / 100) * 100; // round max up to nearest 100
    let minLabel = Math.floor(minValue / 100) * 100; // round min down to nearest 100

    // Zoom in when difference between max and min value is small
    if (maxValue - minValue < 100) {
      maxLabel = Math.ceil(maxValue / 10) * 10; // round max up to nearest 10
      minLabel = Math.floor(minValue / 10) * 10; // round min down to nearest 10
    }

    const labelDistance = (maxLabel - minLabel) / (Y_LABEL_COUNT - 1);

    // From max (top) to min (down)
    return [...Array(Y_LABEL_COUNT).keys()].map(
      i => (Math.round(maxLabel - i * labelDistance)).toString()
    );
  }

  renderXLabels(): ReactElement {
    return (
      <XLabelContainer>
        {[...Array(X_LABEL_COUNT).keys()].map(i => (
          <XLabelsText key={i}>
            {this.xLabels[i]}
          </XLabelsText>
        ))}
      </XLabelContainer>
    );
  }

  renderYLabels(): ReactElement {
    return (
      <YLabelsContainer>
        {[...Array(Y_LABEL_COUNT).keys()].map(i => (
          <YLabelsText key={i} count={i}>
            {this.yLabels[i]}
          </YLabelsText>
        ))}
      </YLabelsContainer>
    );
  }

  render(): ReactElement {
    const { timeSeriesDataLists, dateRange } = this.props;
    const { tooltipData } = this.state;
    const { yLabels } = this;

    if (!timeSeriesDataLists) {
      return <div>Loading</div>;
    }

    // Consider height of the chart is 100%, this calculates a list of percentage of height of each points
    const percentageHeightsList = timeSeriesDataLists.map(timeSeriesDataList => timeSeriesDataList.map(data => (
      (data.value - parseInt(yLabels[Y_LABEL_COUNT - 1], 10)) /
      (parseInt(yLabels[0], 10) - parseInt(yLabels[Y_LABEL_COUNT - 1], 10))
    )));

    const dataList1 = timeSeriesDataLists[0];
    const stockDataColumns: TimeSeriesData[][] = []; // data in columns

    dataList1.forEach((data, i) => {
      stockDataColumns.push(timeSeriesDataLists.map(timeSeriesDataList => timeSeriesDataList[i]));
    });

    return (
      <Root>
        {this.renderYLabels()}

        <LineChartFrame>
          <ColumnsContainer>
            {stockDataColumns.map((stockDataColumn, i) => (
              <Column
                key={stockDataColumn[0].timestamp}
                count={dataList1.length}
                onMouseEnter={e => this.handleColumnMouseEnter(e, stockDataColumn, i)}
                onMouseMove={this.handleColumnMouseMoveBound}
                onMouseLeave={this.handleColumnMouseLeaveBound}
                onMouseDown={() => this.handleColumnMouseDownBound(stockDataColumn, i)}
                onMouseUp={this.handleColumnMouseUpBound}
                isActive={tooltipData && tooltipData.config && tooltipData.config.startColumnIndex === i}
              >
                {
                  // In every column we render points vertically based on how many lines we have
                  timeSeriesDataLists.map((timeSeriesDataList, lineIndex) => (
                    <DataPoint
                      style={{
                        // Here we must put dynamic style here to prevent styled component generate too many classes
                        bottom: (
                          (timeSeriesDataList[i].value - parseInt(yLabels[Y_LABEL_COUNT - 1], 10)) /
                          (parseInt(yLabels[0], 10) - parseInt(yLabels[Y_LABEL_COUNT - 1], 10))
                        ) * CHART_HEIGHT - 6,
                        backgroundColor: timeSeriesDataLists.length > 1 ? diagramColors[lineIndex % diagramColors.length] : "none"
                      }}
                      isBad={LineChart.isDropping(timeSeriesDataList)}
                    />
                  ))
                }
              </Column>
            ))}
          </ColumnsContainer>
          {  // We do not draw last line to prevent overlapping with the background frame
            [...Array(Y_LABEL_COUNT - 1).keys()].map(i => (
              <FrameBackgroundGridLine key={i} count={i} />
            ))
          }

          {
            percentageHeightsList.map((percentageHeights, i) => (
              <LineChartGraphContainer>
                <LineChartGraph
                  percentageHeights={percentageHeights}
                  showGradient={percentageHeightsList.length === 1}
                  color={timeSeriesDataLists.length > 1 ? diagramColors[i % diagramColors.length] : null}
                />
              </LineChartGraphContainer>
            ))
          }
        </LineChartFrame>

        {this.renderXLabels()}

        {tooltipData && (
          <TooltipContainer
            style={{
              top: tooltipData.config.y || "50%", // Default place tooltip in middle
              left: tooltipData.config.x
            }}
            isInverted={tooltipData.config.isInverted}
          >
            {
              tooltipData.startData && tooltipData.startData.map((stockData, i) => (
                <>
                  <TooltipEntryContainer>
                    {timeSeriesDataLists.length > 1 && (
                      <TooltipMultiColorIndicator
                        style={{ background: diagramColors[i % diagramColors.length] }}
                      />
                    )}

                    {tooltipData.startData && !tooltipData.config.mouseIsDown && (
                      <TooltipValueText>
                        {`$${round(stockData.value, 2)}`}
                      </TooltipValueText>
                    )}

                    {
                      // When user press mouse and dragging, show end stock price (at current cursor position)
                      tooltipData.endData && tooltipData.config.mouseIsDown && (
                        <TooltipValueText>
                          {`$${round(tooltipData.endData[i].value, 2)}`}
                        </TooltipValueText>
                      )
                    }
                    <TooltipDateText>
                      {
                        // The data only contains precise timestamp when date range is small
                        dateRange === DateRanges.FiveDays || dateRange === DateRanges.OneMonth ? (
                          moment(stockData.timestamp).format("MMM Do YYYY, H:mm")
                        ) : moment(stockData.timestamp).format("MMM Do YYYY")
                      }
                    </TooltipDateText>
                  </TooltipEntryContainer>

                  {tooltipData.endData && tooltipData.config.endColumnIndex && (
                    <TooltipPercentageChange isBad={
                      LineChart.isTooltipPriceDropping(
                        stockData.value,
                        tooltipData.config.startColumnIndex,
                        tooltipData.endData[i].value,
                        tooltipData.config.endColumnIndex
                      )
                    }>
                      <div>
                        {
                          tooltipData.config.startColumnIndex <= tooltipData.config.endColumnIndex ? (
                            `${round(tooltipData.endData[i].value - stockData.value, 2)}`
                          ) : `${round(stockData.value - tooltipData.endData[i].value, 2)}`
                        }
                      </div>
                      <TooltipPercentageChangeIcon>
                        {LineChart.isTooltipPriceDropping(
                          stockData.value,
                          tooltipData.config.startColumnIndex,
                          tooltipData.endData[i].value,
                          tooltipData.config.endColumnIndex
                        ) ? (
                          <ArrowIconContainer>
                            <img src={ArrowDownIcon} alt="arrow-down" />
                          </ArrowIconContainer>
                        ) : (
                          <ArrowIconContainer>
                            <img src={ArrowUpIcon} alt="arrow-up" />
                          </ArrowIconContainer>
                        )
                        }
                      </TooltipPercentageChangeIcon>
                      <div>
                        {
                          tooltipData.config.startColumnIndex <= tooltipData.config.endColumnIndex ? (
                            `(${round((
                              tooltipData.endData[i].value - stockData.value) * 100 / stockData.value, 2
                            )}%)`
                          ) : `(${round((
                            stockData.value - tooltipData.endData[i].value) * 100 / tooltipData.endData[i].value, 2
                          )}%)`
                        }
                      </div>
                    </TooltipPercentageChange>
                  )}
                </>
              ))
            }
          </TooltipContainer>
        )}
      </Root>
    );
  }
}

export default LineChart;
