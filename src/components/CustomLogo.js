import React from 'react';
import styled from 'styled-components';
import { colors } from '../colors.js';

// Define the path to the custom logo
const customLogoPath = '/assets/integral-analytics-logo.png';

const CustomLogoContainer = styled.a.attrs(props => ({
  href: "https://www.integralanalytics.com",
  target: "_blank",
  rel: "noopener noreferrer",
  className: "custom-logo-container"
}))`
  position: absolute;
  top: ${props => (props.$isSidePanelOpen ? '8px' : '0px')};
  left: ${props => (props.$isSidePanelOpen ? '15px' : '35px')};
  z-index: 10000;
  background-color: ${props => (props.$isSidePanelOpen ? colors.bgDarkerGray : 'transparent')};
  padding: ${props => (props.$isSidePanelOpen ? '6px 10px' : '8px')};
  border-radius: 3px;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: left 0.2s ease-in-out, background-color 0.2s ease-in-out, padding 0.2s ease-in-out, top 0.2s ease-in-out;
  max-height: 40px; /* Constrain height to not interfere with tabs */
  
  &:hover {
    background-color: ${props => (props.$isSidePanelOpen ? colors.bgDeepGray : 'rgba(46, 46, 46, 0.7)')};
  }
`;

const CustomLogoImg = styled.img`
  height: 24px;
  margin-right: 6px;
  filter: brightness(0) invert(1); /* Make logo white for dark backgrounds */
`;

const CustomLogoText = styled.span`
  font-size: 13px;
  color: ${colors.grayLight};
  font-weight: bold;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const CustomLogo = ({ isSidePanelOpen }) => (
  <CustomLogoContainer $isSidePanelOpen={isSidePanelOpen}>
    <CustomLogoImg src={customLogoPath} alt="Integral Analytics Logo" />
    {isSidePanelOpen && <CustomLogoText>Atlas Viewer</CustomLogoText>}
  </CustomLogoContainer>
);

export default CustomLogo;
