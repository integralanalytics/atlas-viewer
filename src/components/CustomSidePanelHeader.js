import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.sidePanelHeaderBg || '#2E2E2E'};
  border-bottom: 1px solid ${props => props.theme.borderColor || '#3C3C3C'};
  min-height: 64px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Logo = styled.img`
  height: 36px;
  width: auto;
  margin-right: 12px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  color: ${props => props.theme.titleTextColor || '#F2F2F2'};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.div`
  color: ${props => props.theme.subtextColor || '#A8A8A8'};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  margin-top: 2px;
`;

const CustomSidePanelHeader = ({ theme = {} }) => {
  return (
    <HeaderContainer theme={theme}>
      <LogoContainer>
        <Logo 
          src={`${process.env.PUBLIC_URL || ''}/assets/integral-analytics-logo.png`}
          alt="Integral Analytics"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <TextContainer>
          <Title theme={theme}>Atlas Viewer</Title>
          <Subtitle theme={theme}>Powered by Integral Analytics</Subtitle>
        </TextContainer>
      </LogoContainer>
    </HeaderContainer>
  );
};

export default CustomSidePanelHeader;
