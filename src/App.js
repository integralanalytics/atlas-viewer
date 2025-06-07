import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// Kepler.gl imports - use scoped packages
import KeplerGl, { injectComponents, PanelHeaderFactory } from '@kepler.gl/components';
import keplerGlReducer from '@kepler.gl/reducers';
import { wrapTo } from '@kepler.gl/actions';

// Import task middleware from react-palm for file processing
import { taskMiddleware } from 'react-palm/tasks';

// Theme and components
import { integralAnalyticsTheme } from './theme';
import CustomSidePanelHeader from './components/CustomSidePanelHeader';
import CustomPanelHeaderFactory from './components/CustomPanelHeaderFactory';
import LoadingScreen from './components/LoadingScreen';

// Loaders.gl registration for Kepler.gl file import support
import { configureLoaders } from './utils/keplerLoaderConfig';

// Import the new add-data-button.css file
import './add-data-button.css';

// We'll configure loaders asynchronously in useEffect
let configuredLoaders = null;

// Create Redux store with initial state that sets Atlas Dark as default
const customizedKeplerGlReducer = keplerGlReducer.initialState({
  mapStyle: {
    styleType: 'atlas_dark' // Only set the default styleType
  },
  mapState: {
    bearing: 0,
    dragRotate: false,
    latitude: 39.1031, // Cincinnati, OH latitude
    longitude: -84.5120, // Cincinnati, OH longitude
    pitch: 0,
    zoom: 9,
    isSplit: false
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer
});

const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk, taskMiddleware)
);

// Debug: Monitor file loading specifically

// Define the custom map styles array outside component to avoid dependency issues
let mapboxUserStyleId = process.env.REACT_APP_MAPBOX_USER_STYLE_ID || '';
const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || '';
const staticImageUrl = mapboxUserStyleId && mapboxToken
  ? `https://api.mapbox.com/styles/v1/${mapboxUserStyleId}/static/-84.5120,39.1031,9/128x128?access_token=${mapboxToken}`
  : `${process.env.PUBLIC_URL || ''}/assets/integral-analytics-logo.png`;

console.log('DEBUG: staticImageUrl for Atlas Dark:', staticImageUrl);

const customMapStyles = [
  {
    id: 'atlas_dark',
    label: 'Atlas Dark',
    url: process.env.REACT_APP_MAPBOX_STYLE_URL || 'mapbox://styles/mapbox/dark-v10', // Fallback to Mapbox dark style if env var is missing
    icon: staticImageUrl
  }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readyToEnter, setReadyToEnter] = useState(false);

  // Initialize the app with loading screen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Configure loaders first (async operation)
        console.log('Configuring Kepler.gl loaders...');
        configuredLoaders = await configureLoaders();
        if (!configuredLoaders) {
          throw new Error('Failed to configure loaders. Please check the configuration.');
        }
        
        // Simulate initialization delay for branding effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Debug: Check if loaders are properly registered
        console.log('App initialized with registered loaders');
        
        // Debug: Add global error handler for unhandled promises
        window.addEventListener('unhandledrejection', event => {
          console.error('Unhandled promise rejection during file loading:', event.reason);
          // Don't prevent default - let the error show in console
        });

        // Debug: Add global error handler
        window.addEventListener('error', event => {
          console.error('Global error during file loading:', event.error);
        });
        setReadyToEnter(true); // Show Enter Map button
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);
  const handleEnterMap = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={readyToEnter ? handleEnterMap : undefined} />;
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1A1A1A',
        color: '#F2F2F2',
        flexDirection: 'column'
      }}>
        <h1>Error Loading Atlas Viewer</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#339AF0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }
  // Inject custom components to replace the default Kepler.gl header
  const CustomKeplerGl = injectComponents([
    [PanelHeaderFactory, CustomPanelHeaderFactory]
  ]);
  return (
    <Provider store={store}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <CustomKeplerGl
          id="atlas-viewer"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN || ''}
          width={window.innerWidth}
          height={window.innerHeight}
          theme={integralAnalyticsTheme}
          cloudProviders={[]}
          mapStyles={customMapStyles} // Add custom style alongside defaults
          mapStylesReplaceDefault={false} // Keep default styles
        />
      </div>
    </Provider>
  );
}

export default App;
