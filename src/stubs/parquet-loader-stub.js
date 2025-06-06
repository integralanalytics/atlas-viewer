// Stub parquet loader to prevent WASM issues
// This module replaces @loaders.gl/parquet to avoid WASM initialization errors

export const ParquetLoader = {
  name: 'Parquet',
  id: 'parquet',
  module: 'parquet',
  version: '3.4.15',
  worker: false,
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  category: 'table',
  binary: true,
  options: {
    parquet: {
      parseInBatches: true,
      batchSize: 'auto',
      shape: 'object-row-table'
    }
  },
  // Provide a safe parse function that returns empty data
  parse: async (arrayBuffer, options) => {
    console.warn('Parquet loading disabled to prevent WASM issues. Please use CSV or Arrow files instead.');
    return {
      data: [],
      schema: [],
      length: 0
    };
  },
  parseSync: (arrayBuffer, options) => {
    console.warn('Parquet loading disabled to prevent WASM issues.');
    return {
      data: [],
      schema: [],
      length: 0
    };
  },
  parseInBatches: async function* (arrayBuffer, options) {
    console.warn('Parquet loading disabled to prevent WASM issues.');
    yield {
      data: [],
      schema: [],
      length: 0
    };
  }
};

export default ParquetLoader;
