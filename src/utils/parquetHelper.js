// Utility functions for handling Parquet files in Kepler.gl
import { addDataToMap } from '@kepler.gl/actions';
import { load } from '@loaders.gl/core';
import { ParquetLoader } from '@loaders.gl/parquet';

/**
 * Load a Parquet file and add it to Kepler.gl using the standard pipeline
 * @param {File} file - File object to load
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} mapId - Kepler.gl map instance ID
 * @returns {Promise<void>}
 */
export const loadParquetFileToKepler = async (file, dispatch, mapId = 'atlas-viewer') => {
  try {
    console.log('Loading Parquet file for Kepler.gl:', file.name);
    
    // Use standard Kepler.gl data loading approach
    // This will use the registered loaders automatically
    const datasets = {
      info: {
        label: file.name.replace('.parquet', ''),
        id: file.name
      },
      data: file // Pass the raw file, let Kepler.gl process it
    };

    // Use Kepler.gl's standard addDataToMap action
    dispatch(addDataToMap({
      datasets,
      options: {
        centerMap: true,
        readOnly: false,
        keepExistingConfig: false
      },
      config: {}
    }));

    console.log('Parquet file added to Kepler.gl successfully');
  } catch (error) {
    console.error('Error loading Parquet file to Kepler.gl:', error);
    throw new Error(`Failed to load Parquet file: ${error.message}`);
  }
};

/**
 * Validate if a file is a valid Parquet file
 * @param {File} file - File to validate
 * @returns {boolean} True if valid Parquet file
 */
export const isValidParquetFile = (file) => {
  if (!file) return false;
  
  const validExtensions = ['.parquet', '.pq'];
  const fileName = file.name.toLowerCase();
  
  return validExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Preview Parquet file data without loading into Kepler.gl
 * @param {File} file - File to preview
 * @param {number} sampleSize - Number of rows to sample
 * @returns {Promise<Object>} Sample data for preview
 */
export const previewParquetFile = async (file, sampleSize = 100) => {
  try {
    // Use the correct WASM URL for loaders.gl 4.3.3
    const data = await load(file, ParquetLoader, {
      parquet: {
        wasmUrl: 'https://unpkg.com/@loaders.gl/parquet@4.3.3/dist/parquet-wasm.wasm'
      }
    });

    console.log('Loaded parquet data type:', typeof data, data);

    // Handle Apache Arrow Table format
    let rows = [];
    let columns = [];
    let totalRows = 0;

    if (data && typeof data === 'object') {
      if (Array.isArray(data)) {
        // If it's already an array of objects
        rows = data;
        columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        totalRows = rows.length;
      } else if (data.toArray && typeof data.toArray === 'function') {
        // If it's an Apache Arrow Table
        rows = data.toArray();
        columns = data.schema ? data.schema.fields.map(field => field.name) : [];
        totalRows = data.numRows || rows.length;
      } else if (data.schema && data.batches) {
        // If it's an Apache Arrow Table with batches
        columns = data.schema.fields.map(field => field.name);
        totalRows = data.numRows || 0;
        
        // Convert batches to rows
        const allRows = [];
        for (const batch of data.batches) {
          const batchData = batch.toArray ? batch.toArray() : [];
          allRows.push(...batchData);
        }
        rows = allRows;
      } else {
        // Try to extract data from object properties
        const keys = Object.keys(data);
        if (keys.length > 0) {
          columns = keys;
          // Assume it's column-oriented data
          const firstColumn = data[keys[0]];
          if (Array.isArray(firstColumn)) {
            totalRows = firstColumn.length;
            rows = [];
            for (let i = 0; i < Math.min(totalRows, sampleSize); i++) {
              const row = {};
              keys.forEach(key => {
                row[key] = data[key][i];
              });
              rows.push(row);
            }
          }
        }
      }
    }

    // Limit sample size
    const limitedData = rows.slice(0, sampleSize);

    return {
      columns,
      rowCount: totalRows,
      totalRows,
      sample: limitedData.slice(0, Math.min(5, limitedData.length))
    };
  } catch (error) {
    console.error('Error sampling Parquet file:', error);
    throw error;
  }
};
