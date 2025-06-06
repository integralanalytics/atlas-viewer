import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// Kepler.gl imports - use scoped packages
import KeplerGl from '@kepler.gl/components';
import { addDataToMap } from '@kepler.gl/actions';
import keplerGlReducer from '@kepler.gl/reducers';

// Theme and components
import { integralAnalyticsTheme } from './theme';
import CustomSidePanelHeader from './components/CustomSidePanelHeader';
import LoadingScreen from './components/LoadingScreen';
import { processParquetFile, processCsvFile, processGeoJsonFile } from './utils/fileLoaders';

// Loaders.gl registration for Kepler.gl file import support
import { registerLoaders } from '@loaders.gl/core';
import { ParquetLoader } from '@loaders.gl/parquet';
import { ArrowLoader } from '@loaders.gl/arrow';
import { JSONLoader } from '@loaders.gl/json';
import { CSVLoader } from '@loaders.gl/csv';

// Register all relevant loaders for Kepler.gl
registerLoaders([ParquetLoader, ArrowLoader, JSONLoader, CSVLoader]);
console.log('Registered loaders:', [ParquetLoader, ArrowLoader, JSONLoader, CSVLoader]);

// Create Redux store
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk)
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the app with loading screen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization delay for branding effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // App is ready - no automatic data loading
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadFile = useCallback(async (file, fileName, fileType) => {
    try {
      console.log(`Processing file: ${fileName} (${fileType})`);
      let data, config;
      
      switch (fileType) {
        case 'parquet':
        case 'geoparquet':
          ({ data, config } = await processParquetFile(file, fileName));
          break;
        case 'csv':
          ({ data, config } = await processCsvFile(file, fileName));
          break;
        case 'geojson':
          ({ data, config } = await processGeoJsonFile(file, fileName));
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Add data to Kepler.gl
      store.dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: fileName,
              id: fileName.replace(/\.[^/.]+$/, "")
            },
            data
          },
          option: {
            centerMap: true,
            readOnly: false
          },
          config
        })
      );
      
      console.log(`Successfully loaded and mapped: ${fileName}`);
    } catch (err) {
      console.error(`Failed to load file ${fileName}:`, err);
      // Don't set error state for sample data loading failures
      if (!fileName.includes('coverage') && !fileName.includes('entities') && !fileName.includes('features')) {
        setError(`Failed to load ${fileName}: ${err.message}`);
      }
    }
  }, []);

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
    return <LoadingScreen />;
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

  return (
    <Provider store={store}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <KeplerGl
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
          sidePanelHeader={() => <CustomSidePanelHeader />}
        />
      </div>
    </Provider>
  );
}

export default App;
