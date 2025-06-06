import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const spin = keyframes`
  to { 
    transform: rotate(360deg); 
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #339AF0 0%, #005EB8 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  animation: ${fadeIn} 0.3s ease-out;

  &.fade-out {
    opacity: 0;
    pointer-events: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 2rem;
  animation: ${pulse} 2s infinite;
  filter: brightness(0) invert(1);
`;

const LoadingText = styled.h1`
  color: #fff;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`;

const LoadingSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 200;
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 1s ease-out 0.6s both;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 1s ease-in-out infinite, ${fadeIn} 1.2s ease-out 0.8s both;
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
  width: 300px;
  animation: ${fadeIn} 1.4s ease-out 1s both;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #fff;
  border-radius: 1px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing Atlas Viewer...');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const steps = [
      { text: 'Initializing Atlas Viewer...', duration: 400 },
      { text: 'Loading Kepler.gl components...', duration: 600 },
      { text: 'Applying custom theme...', duration: 400 },
      { text: 'Setting up data processors...', duration: 300 },
      { text: 'Configuring map layers...', duration: 400 },
      { text: 'Ready to explore data!', duration: 200 }
    ];

    let currentStepIndex = 0;
    let currentProgress = 0;

    const updateProgress = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setCurrentStep(step.text);
        
        const increment = 100 / steps.length;
        const targetProgress = (currentStepIndex + 1) * increment;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
            currentStepIndex++;
            
            if (currentStepIndex < steps.length) {
              setTimeout(updateProgress, 100);
            } else {
              setProgress(100); // Ensure 100% on finish
              setReady(true); // Show button when ready
            }
          }
          setProgress(Math.min(currentProgress, 100));
        }, 20);

        setTimeout(() => {
          clearInterval(progressInterval);
          currentProgress = targetProgress;
          setProgress(targetProgress);
          currentStepIndex++;
          
          if (currentStepIndex < steps.length) {
            setTimeout(updateProgress, 100);
          } else {
            setProgress(100); // Ensure 100% on finish
            setReady(true); // Show button when ready
          }
        }, step.duration);
      }
    };

    const startTimer = setTimeout(updateProgress, 500);

    return () => {
      clearTimeout(startTimer);
    };
  }, [onComplete]);

  return (
    <LoadingContainer>
      <LogoContainer>
        <Logo 
          src="/assets/integral-analytics-logo.png" 
          alt="Integral Analytics"
          onError={(e) => {
            // If logo fails to load, hide it gracefully
            e.target.style.display = 'none';
          }}
        />
        <LoadingText>Atlas Viewer</LoadingText>
        <LoadingSubtitle>Geospatial Data Visualization Platform</LoadingSubtitle>
        <LoadingSubtitle>Powered By: kepler.gl</LoadingSubtitle>
      </LogoContainer>
      
      <LoadingSpinner />
      
      <ProgressContainer>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '14px', 
          marginBottom: '8px',
          textAlign: 'center',
          minHeight: '20px'
        }}>
          {currentStep}
        </div>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        <div style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          {Math.round(progress)}%
        </div>
      </ProgressContainer>
      
      {ready && (
        <button
          style={{
            marginTop: '2.5rem',
            padding: '12px 32px',
            background: '#fff',
            color: '#339AF0',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'background 0.2s, color 0.2s, transform 0.1s',
            outline: 'none'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px) scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = ''}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          onClick={onComplete}
        >
          Enter Map
        </button>
      )}
    </LoadingContainer>
  );
};

export default LoadingScreen;
