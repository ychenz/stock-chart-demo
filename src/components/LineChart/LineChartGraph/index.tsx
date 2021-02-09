import React, { ReactElement, PureComponent } from "react";
import { cssColors } from "src/styles/css";
import {
  Root,
  SvgPolyLine,
  ClippedGradient,
} from "./styles";

interface LineChartGraphProps {
  percentageHeights: number[];
  showGradient?: boolean;
  color?: string|null;
}

class LineChartGraph extends PureComponent<LineChartGraphProps> {
  render(): ReactElement {
    const { percentageHeights, showGradient, color } =  this.props;

    // This draws a polygon mask on top of gradient background using percentage data
    // e.g: clip-path: polygon(5% 5%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
    const maskPolygonPoints = percentageHeights.map((percentageHeight, i) => (
      // Points order: "percentageWidth% percentageHeight%", 0% is at top-left corner, so for height we need 1-height
      `${(100/percentageHeights.length)*(i+1)}% ${(1-percentageHeight)*100}%`
    ));

    const isDropping = percentageHeights[0] >= percentageHeights[percentageHeights.length - 1];
    const cornerPoints = ["100% 100%", `${(100/percentageHeights.length)}% 100%`];
    const allMaskPolygonPoints = maskPolygonPoints.concat(cornerPoints);

    let polylinePoints: string[] = [];
    percentageHeights.forEach((percentage, i) => {
      const x = 100 / percentageHeights.length * (i + 1);
      const y = 100 - percentage * 100;
      polylinePoints = polylinePoints.concat(`${x},${y}`);
    });

    // Determine line color
    let lineColor = isDropping ? cssColors.colorBloodRed : cssColors.colorSoftGreen;

    if (color) {
      lineColor = color;
    }

    return (
      <Root>
        <SvgPolyLine
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={polylinePoints.join(" ")}
            strokeWidth={2}
            stroke={lineColor}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </SvgPolyLine>
        {showGradient && (
          <ClippedGradient
            polygonPoints={allMaskPolygonPoints.join(",")}
            isBad={isDropping}
          />
        )}
      </Root>
    );
  }
}

export default LineChartGraph;
