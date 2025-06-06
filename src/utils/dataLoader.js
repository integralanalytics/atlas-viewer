import { addDataToMap } from '@kepler.gl/actions';
import { wrapTo } from '@kepler.gl/reducers';

/**
 * Utility functions for loading and processing various data formats
 * including parquet files for the Atlas Viewer using Kepler.gl's built-in loaders
 */

/**
 * Load a parquet file and add it to the Kepler.gl map
 * @param {string} filePath - Path to the parquet file
 * @param {string} datasetName - Name for the dataset
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - ID of the Kepler.gl map instance
 */
export const loadParquetFile = async (filePath, datasetName, dispatch, mapId = 'map') => {
  try {
    console.log(`Loading parquet file: ${filePath}`);
    
    // Fetch the parquet file as a blob
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch parquet file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const file = new File([blob], datasetName + '.parquet', { type: 'application/octet-stream' });
    
    console.log('Dispatching parquet file to Kepler.gl using auto-detection...');
    
    // Use Kepler.gl's built-in file loading approach which should auto-detect parquet
    dispatch(
      wrapTo(
        mapId,
        addDataToMap({
          datasets: {
            info: {
              label: datasetName,
              id: datasetName.toLowerCase().replace(/\s+/g, '_')
            },
            data: file
          },
          options: {
            centerMap: true,
            readOnly: false
          }
        })
      )
    );
    
    console.log(`Successfully loaded parquet file: ${datasetName}`);
  } catch (error) {
    console.error('Error loading parquet file:', error);
    throw error;
  }
};

/**
 * Load a GeoJSON file and add it to the map
 * @param {string} filePath - Path to the GeoJSON file
 * @param {string} datasetName - Name for the dataset
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - ID of the Kepler.gl map instance
 */
export const loadGeoJsonFile = async (filePath, datasetName, dispatch, mapId = 'map') => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON file: ${response.statusText}`);
    }
    
    const geoJsonData = await response.json();
    
    dispatch(
      wrapTo(
        mapId,
        addDataToMap({
          datasets: {
            info: {
              label: datasetName,
              id: datasetName.toLowerCase().replace(/\s+/g, '_')
            },
            data: geoJsonData
          },
          options: {
            centerMap: true,
            readOnly: false
          }
        })
      )
    );
    
    console.log(`Successfully loaded GeoJSON file: ${datasetName}`);
  } catch (error) {
    console.error('Error loading GeoJSON file:', error);
    throw error;
  }
};

/**
 * Load multiple data files sequentially
 * @param {Array} files - Array of file objects with { path, name, type }
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - ID of the Kepler.gl map instance
 */
export const loadMultipleFiles = async (files, dispatch, mapId = 'map') => {
  const results = [];
  
  for (const file of files) {
    try {
      if (file.type === 'parquet') {
        await loadParquetFile(file.path, file.name, dispatch, mapId);
      } else if (file.type === 'geojson') {
        await loadGeoJsonFile(file.path, file.name, dispatch, mapId);
      }
      results.push({ file: file.name, status: 'success' });
    } catch (error) {
      console.error(`Failed to load ${file.name}:`, error);
      results.push({ file: file.name, status: 'error', error: error.message });
    }
  }
  
  return results;
};

/**
 * Create sample dataset for demonstration
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - ID of the Kepler.gl map instance
 */
export const loadSampleData = (dispatch, mapId = 'map') => {
  const sampleData = {
    info: {
      label: 'Sample Locations',
      id: 'sample_locations'
    },
    data: {
      fields: [
        { name: 'id', format: '', type: 'integer' },
        { name: 'name', format: '', type: 'string' },
        { name: 'latitude', format: '', type: 'real' },
        { name: 'longitude', format: '', type: 'real' },
        { name: 'value', format: '', type: 'integer' },
        { name: 'category', format: '', type: 'string' }
      ],
      rows: [
        [1, 'San Francisco', 37.7749, -122.4194, 100, 'Tech Hub'],
        [2, 'New York City', 40.7128, -74.0060, 200, 'Financial Center'],
        [3, 'Los Angeles', 34.0522, -118.2437, 150, 'Entertainment'],
        [4, 'Chicago', 41.8781, -87.6298, 180, 'Industrial'],
        [5, 'Boston', 42.3601, -71.0589, 120, 'Education'],
        [6, 'Seattle', 47.6062, -122.3321, 140, 'Tech Hub'],
        [7, 'Austin', 30.2672, -97.7431, 90, 'Tech Hub'],
        [8, 'Denver', 39.7392, -104.9903, 110, 'Energy']
      ]
    }
  };

  dispatch(
    wrapTo(
      mapId,
      addDataToMap({
        datasets: sampleData,
        options: {
          centerMap: true,
          readOnly: false
        }
      })
    )
  );
  
  console.log('Sample data loaded successfully');
};
