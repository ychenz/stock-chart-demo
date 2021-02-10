import React from "react";

import {
  Root,
  DateRangeButton
} from "./styles";
import { DateRanges } from "./types";

interface DateRangeSelectorProps {
  dateRange: DateRanges; // current selected date range
  onRangeSelected(dateRange: DateRanges): void;
}

class DateRangeSelector extends React.PureComponent<DateRangeSelectorProps> {
  render(): React.ReactElement {
    const { dateRange, onRangeSelected } = this.props;
    const allDateRanges = [
      DateRanges.FiveDays,
      DateRanges.OneMonth,
      DateRanges.SixMonths,
      DateRanges.OneYear,
      DateRanges.FiveYears,
      DateRanges.TenYears
    ];

    return (
      <Root>
        {allDateRanges.map(range => (
          <DateRangeButton
            key={range}
            isActive={range === dateRange}
            onClick={() => onRangeSelected(range)}
          >
            {range}
          </DateRangeButton>
        ))}
      </Root>
    );
  }
}

export default DateRangeSelector;