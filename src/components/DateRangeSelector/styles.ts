import styled from "styled-components";
import { cssVariables } from "src/styles/css";

export const Root = styled.div`
  display: flex;
  align-items: center;
`;

export const DateRangeButton = styled.div<{ isActive: boolean }>`
  font-family: ${cssVariables.titleFontFamily};
  font-size: ${cssVariables.smallFontSize};
  line-height: 20px;
  border-radius: ${cssVariables.largeBorderRadius};
  margin-right: 32px;
  padding: 0 ${cssVariables.uiUnit};
  cursor: pointer;
  
  ${({ isActive }) => isActive && `
    text-shadow: 0 0 1px black;
    text-decoration: underline;
  `};
  
  &:hover {
    text-shadow: 0 0 1px black;
  }
  
  // Last child of this should not have margin
  &:last-child {
    margin-right: 0;
  }
`;