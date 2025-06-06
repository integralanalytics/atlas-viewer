/**
 * Demo data configuration for Atlas Viewer
 * This file contains sample datasets for testing and demonstration
 */

export const DEMO_DATASETS = {
  coverage: {
    name: 'Coverage Analysis',
    description: 'Sample coverage data in GeoJSON format',
    path: '/tests/data/coverage.geojson',
    type: 'geojson'
  },
  coverageTable: {
    name: 'Coverage Table',
    description: 'Tabular coverage data in Parquet format',
    path: '/tests/data/coverage_table.parquet',
    type: 'parquet'
  },
  entitiesAnalysis: {
    name: 'Entities Analysis',
    description: 'Geospatial entities analysis in GeoParquet format',
    path: '/tests/data/entities_analysis.geoparquet',
    type: 'geoparquet'
  },
  features: {
    name: 'Features Dataset',
    description: 'Feature data in Parquet format',
    path: '/tests/data/features.parquet',
    type: 'parquet'
  }
};

/**
 * Load a demo dataset by key
 * @param {string} datasetKey - Key from DEMO_DATASETS
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - Kepler.gl map instance ID
 */
export const loadDemoDataset = async (datasetKey, dispatch, mapId = 'map') => {
  const dataset = DEMO_DATASETS[datasetKey];
  if (!dataset) {
    throw new Error(`Dataset '${datasetKey}' not found`);
  }

  try {
    const response = await fetch(dataset.path);
    if (!response.ok) {
      throw new Error(`Failed to load ${dataset.name}: ${response.statusText}`);
    }

    let data;
    if (dataset.type === 'geojson') {
      data = await response.json();
    } else {
      // For parquet files, we'll get the raw data and let Kepler.gl handle it
      const arrayBuffer = await response.arrayBuffer();
      data = new File([arrayBuffer], `${dataset.name}.${dataset.type}`, {
        type: 'application/octet-stream'
      });
    }

    // Import the loader function
    const { loadDataToMap } = await import('./dataLoader');
    
    if (dataset.type === 'geojson') {
      return await loadDataToMap(data, dataset.name, dispatch, mapId);
    } else {
      return await loadDataToMap(data, dataset.name, dispatch, mapId);
    }
  } catch (error) {
    console.error(`Error loading demo dataset ${datasetKey}:`, error);
    throw error;
  }
};
