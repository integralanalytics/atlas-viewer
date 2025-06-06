import React, { useState, useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// Kepler.gl imports - use scoped packages
import KeplerGl, { injectComponents, PanelHeaderFactory } from '@kepler.gl/components';
import keplerGlReducer from '@kepler.gl/reducers';

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

// Create Redux store
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk, taskMiddleware)
);

// Debug: Monitor file loading specifically
store.subscribe(() => {
  // Debug logging removed for production cleanliness
});

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

  const keplerGlConfig = useMemo(() => ({
    version: 'v1',
    config: {
      visState: {
        filters: [],
        layers: [],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {},
            enabled: true
          },
          brush: {
            size: 0.5,
            enabled: false
          }
        }
      },
      mapState: {
        bearing: 0,
        dragRotate: false,
        latitude: 37.7749,
        longitude: -122.4194,
        pitch: 0,
        zoom: 9,
        isSplit: false
      },
      mapStyle: {
        styleType: 'dark',
        topLayerGroups: {},
        visibleLayerGroups: {
          label: true,
          road: true,
          border: false,
          building: true,
          water: true,
          land: true,
          '3d building': false
        },
        threeDBuildingColor: [9.665468314072013, 17.18305478057247, 31.1442867897876],
        mapStyles: {}
      }
    }
  }), []);

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
          uiState={{
            activeSidePanel: 'layer',
            currentModal: null
          }}
        />
      </div>
    </Provider>
  );
}

export default App;
