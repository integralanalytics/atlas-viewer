import { colors } from './colors.js';

// Custom Integral Analytics theme based on the brand colors
export const integralAnalyticsTheme = {
  // Main Colors
  primaryColor: colors.primaryDeepBlue, // Changed from primaryBrightBlue
  secondaryColor: colors.primaryBrightBlue, // Changed from secondaryRoyalBlue

  // Backgrounds
  sidePanelBg: colors.bgDeepGray,
  titleTextColor: colors.grayLight,
  sidePanelHeaderBg: colors.bgDarkerGray,
  panelBackground: colors.bgDarkerGray,
  panelBackgroundHover: colors.grayCharcoal,
  panelActiveBg: colors.primaryLightBlue, // Changed from grayLight for a touch of blue

  // Interactive Elements
  subtextColorActive: colors.primaryBrightBlue,
  tooltipBg: colors.primaryDeepBlue,
  tooltipColor: colors.grayLight,
  dropdownListBgd: colors.bgDarkerGray,
  textColorHl: colors.primaryLightBlue,

  // Input Fields
  inputBgd: colors.bgDarkerGray,
  inputBgdHover: colors.grayCharcoal,
  inputBgdActive: colors.grayCharcoal,
  dropdownListHighlightBg: colors.primaryMediumBlue, // Changed from grayMediumDark

  // Secondary Elements
  secondaryInputBgd: colors.bgDarkerGray,
  secondaryInputBgdActive: colors.bgDarkerGray,
  secondaryInputBgdHover: colors.grayCharcoal,

  // Additional Theme Properties
  activeColor: colors.primaryBrightBlue,
  textColor: colors.grayLight,
  labelColor: colors.coolGrayLight,
  mapPanelBackgroundColor: colors.bgDeepGray,
  mapPanelHeaderBackgroundColor: colors.bgDarkerGray,

  // Button Colors
  buttonBgd: colors.primaryBrightBlue,
  buttonColor: colors.bgLight,
  buttonBgdHover: colors.primaryDeepBlue,
  buttonBgdActive: colors.primaryDeepBlue,

  // Accent Colors - Let's use a blue-gray for a more subtle accent
  accentColor: colors.blueGrayMid, // Changed from yellowBright
  highlightColor: colors.primaryLightBlue, // Changed from yellowBright

  // Chart Colors
  chartColors: [
    colors.primaryDeepBlue,
    colors.primaryBrightBlue,
    colors.secondaryMidBlue,
    colors.blueGrayMid, // Changed from blueGrayDark
    colors.primaryMediumBlue, // Changed from primaryDeepBlue (already used)
    colors.secondaryRoyalBlue, // Changed from secondaryNavyBlue
    colors.blueGrayLight, // Changed from yellowMustard
    colors.grayMid // Changed from grayDark
  ],

  // Extended Kepler.gl theme properties for compatibility
  panelContentBackground: colors.bgDarkerGray,
  subtextColor: colors.coolGrayLight,
  activeColorHover: colors.primaryMediumBlue,
  selectColor: colors.primaryLightBlue,
  selectColorLT: colors.primaryLightBlue,
  
  inputBorderColor: colors.grayCharcoal,
  inputBorderActiveColor: colors.primaryBrightBlue,
  inputColor: colors.grayLight,
  
  dropdownListBorderTop: `1px solid ${colors.grayCharcoal}`,
  dropdownListShadow: '0 6px 12px 0 rgba(0, 0, 0, 0.16)',
  
  // Primary buttons
  primaryBtnBgd: colors.primaryBrightBlue,
  primaryBtnActBgd: colors.primaryDeepBlue,
  primaryBtnColor: colors.bgLight,
  primaryBtnActColor: colors.bgLight,
  primaryBtnBgdHover: colors.primaryMediumBlue,
  
  // Secondary buttons
  secondaryBtnBgd: colors.bgDarkerGray,
  secondaryBtnActBgd: colors.primaryLightBlue,
  secondaryBtnColor: colors.grayLight,
  secondaryBtnActColor: colors.primaryDeepBlue,
  secondaryBtnBgdHover: colors.grayCharcoal,
  
  // Negative/danger buttons
  negativeBtnBgd: '#d73527',
  negativeBtnActBgd: '#a82319',
  negativeBtnBgdHover: '#c42e1a',
  
  // Links
  linkBtnBgd: 'transparent',
  linkBtnColor: colors.primaryBrightBlue,
  linkBtnActColor: colors.primaryDeepBlue,
  linkBtnActBgd: colors.primaryLightBlue,
  
  // Modal and overlays
  modalBgd: colors.bgDarkerGray,
  modalBgdHover: colors.grayCharcoal,
  modalHeaderBgd: colors.bgDeepGray,
  modalHeaderColor: colors.grayLight,
  modalFooterBgd: colors.bgDeepGray,
  modalContentBgd: colors.bgDarkerGray,
  
  // Border colors
  borderColor: colors.grayCharcoal,
  borderColorLT: colors.grayMid,
  
  // Special brand accent colors
  brandPrimary: colors.primaryBrightBlue,
  brandSecondary: colors.secondaryRoyalBlue,
  brandAccent: colors.blueGrayMid,
  
  // Loading and progress
  loadingBg: colors.primaryLightBlue,
  
  // Error states
  errorColor: '#d73527',
  
  // Success states  
  successColor: '#00a854',
  
  // Warning states
  warningColor: colors.yellowMustard,
  
  // Switch and checkbox controls
  switchTrackBgd: colors.grayCharcoal,
  switchTrackBgdActive: colors.primaryBrightBlue,
  switchBtnBgd: colors.grayLight,
  switchBtnBgdActive: colors.grayLight,
  
  // Chicklets and tags
  chickletBgd: colors.primaryLightBlue,
  chickletBgdHover: colors.primaryMediumBlue,
  chickletColor: colors.primaryDeepBlue,
  
  // Range slider
  sliderBarColor: colors.grayCharcoal,
  sliderBarBgd: colors.bgDeepGray,
  sliderHandleColor: colors.primaryBrightBlue,
  sliderHandleHoverColor: colors.primaryDeepBlue,
  
  // Histogram and charts
  histogramFillInRange: colors.primaryBrightBlue,
  histogramFillOutRange: colors.grayCharcoal,
  
  // Logo positioning (custom properties for our implementation)
  logoBackground: colors.bgDarkerGray,
  logoBackgroundCollapsed: 'transparent',
  logoTextColor: colors.grayLight
};
