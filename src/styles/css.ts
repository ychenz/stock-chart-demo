export const cssColors = {
  colorUiPrimary: "#A161BF",
  colorModernBlue: "#1DA7DA",
  colorSoftGreen: "#52D58B", // color good
  colorDarkSoftGreen: "#4DD488",
  colorBloodRed: "#EE443A", // color bad
  colorWarmOrange: "#F06E10",
  colorLightOrange: "#F1B236",
  colorBgPrimary: "#505050",
  colorTitle1: "#505050",
  colorWhite: "#FFFFFF",
  colorGray3: "#E5E5E5", // hover background
  colorGray4: "#3E454C",
  colorGray5: "#999999",
  colorGray6: "#565656",
  colorBlack: "#1F1F1F",
  colorGreen: "#00FF00",
  colorTransparent: "transparent",
  colorGoodTransparent: "rgba(82, 213, 139, 0.8)",
  colorBadTransparent: "rgba(238, 68, 58, 0.8)",

  colorBorder: "black",
};

export const cssVariables = {
  uiUnit: "8px",
  uiUnitHalf: "4px",
  uiUnitDouble: "16px",
  heavyFontWeight: 600,
  mediumFontWeight: 500,
  pentaLargeFontSize: "48px",
  xxxLargeFontSize: "40px",
  xxLargeFontSize: "24px",
  xLargeFontSize: "18px",
  largeFontSize: "16px",
  mediumFontSize: "14px",
  smallFontSize: "12px",
  xSmallFontSize: "8px",

  paragraphFontSize: "20px",
  paragraphLineHeight: "32px",

  postContentMaxWidth: "768px",
  postContentMinWidth: "320px",
  screenMedium: "820px",
  screenLarge: "970px",

  smallBorderRadius: "4px",
  mediumBorderRadius: "8px",
  largeBorderRadius: "10px",
  xLargeBorderRadius: "12px",

  titleFontFamily: "Saira, sans-serif",
  contentFontFamily: "Nunito, sans-serif",

  boxShadowHoverStyle: `
    &:hover {
      box-shadow: 0 4px 6px rgba(2, 14, 29, 0.08);
    }
  `,
  focusStyle: `
    &:focus {
      outline: none;
      
      &:not(:active) {
          background: ${cssColors.colorGray3};
      }
    }
  `,
};

export const WPCategoryColors = [
  cssColors.colorModernBlue,
  cssColors.colorSoftGreen,
  cssColors.colorDarkSoftGreen,
  cssColors.colorWarmOrange,
  cssColors.colorLightOrange
];
