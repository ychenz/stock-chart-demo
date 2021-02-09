import styled from "styled-components";
import { cssColors } from "src/styles/css";

export const Root = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const SvgPolyLine = styled.svg`
  height: 100%;
  width: 100%;
  z-index: 2;
`;

export const ClippedGradient = styled.div<{ polygonPoints: string; isBad: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 1;

  clip-path: polygon(${({ polygonPoints }) => polygonPoints});

  background: linear-gradient(
    180deg,
    ${({ isBad }) => isBad ? cssColors.colorBadTransparent : cssColors.colorGoodTransparent} 5.59%, // Green on top if raising
    ${cssColors.colorTransparent} 105.59%  // Red at top if dropping
  );
`;
