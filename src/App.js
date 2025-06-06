import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import KeplerGl, { injectComponents } from '@kepler.gl/components';
import { PanelHeaderFactory } from '@kepler.gl/components';

import { integralAnalyticsTheme } from './theme';
import CustomPanelHeaderFactory from './components/HiddenPanelHeader';

// Inject custom components to replace the default Kepler.gl header
const CustomKeplerGl = injectComponents([
  [PanelHeaderFactory, CustomPanelHeaderFactory]
]);

// Environment variable for MapBox token - you'll need to set this
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'your_mapbox_token_here';

function App() {
  const dispatch = useDispatch();
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize the app
  useEffect(() => {
    // Initialize the app
    dispatch({ type: 'INIT_APP' });
  }, [dispatch]);

  return (
    <ThemeProvider theme={integralAnalyticsTheme}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Kepler.gl Map with Custom Header */}
        <CustomKeplerGl
          id="map"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          width={windowDimension.width}
          height={windowDimension.height}
          theme={integralAnalyticsTheme}
          appName="Atlas Viewer"
          version="1.0.0"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
