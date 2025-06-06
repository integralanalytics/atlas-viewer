import React from 'react';
import styled from 'styled-components';
import { PanelHeaderFactory } from '@kepler.gl/components';
import { colors } from '../colors.js';

// Define the path to the custom logo
const customLogoPath = '/assets/integral-analytics-logo.png';

const CustomHeaderContainer = styled.div`
  background-color: ${colors.bgDarkerGray};
  padding: 12px 16px;
  display: flex;
  align-items: center;
  min-height: 48px;
  position: relative;
`;

const CustomLogoLink = styled.a.attrs({
  href: "https://www.integralanalytics.com",
  target: "_blank",
  rel: "noopener noreferrer"
})`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CustomLogoImg = styled.img`
  height: 24px;
  margin-right: 8px;
  filter: brightness(0) invert(1); /* Make logo white for dark backgrounds */
`;

const CustomLogoText = styled.span`
  font-size: 14px;
  color: ${colors.grayLight};
  font-weight: 600;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
`;

// Custom PanelHeader component to replace Kepler.gl's default header
const CustomPanelHeader = () => (
  <CustomHeaderContainer>
    <CustomLogoLink>
      <CustomLogoImg src={customLogoPath} alt="Integral Analytics Logo" />
      <CustomLogoText>Atlas Viewer</CustomLogoText>
    </CustomLogoLink>
  </CustomHeaderContainer>
);

// Custom PanelHeaderFactory that returns our custom header
const CustomPanelHeaderFactory = () => CustomPanelHeader;

export default CustomPanelHeaderFactory;
