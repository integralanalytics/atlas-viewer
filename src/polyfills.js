// Enhanced polyfills for Kepler.gl with loaders.gl compatibility
// Browser polyfills for Node.js globals
import { Buffer } from 'buffer';
import process from 'process/browser.js';

// Make globals available
window.Buffer = Buffer;
window.process = process;
window.global = window;

// Ensure process.env exists
if (!process.env) {
  process.env = {};
}

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Add support for WebAssembly loading but with safeguards
if (typeof WebAssembly === 'undefined') {
  console.warn('WebAssembly is not supported in this environment');
}

// Import compatibility layers and configure ParquetLoader WASM path early
import { patchKeplerGlProcessors } from './loaders-compat.js';  
import { polyfillWasmFunctions } from './wasm-helper.js';

// Initialize compatibility patches
patchKeplerGlProcessors();

// Initialize WASM polyfills
polyfillWasmFunctions();

// Configure ParquetWasmLoader WASM path early in the application lifecycle
async function configureParquetWasmLoader() {
  try {
    // Import ParquetWasmLoader from Kepler.gl's dependencies
    const { ParquetWasmLoader } = await import('@kepler.gl/processors/node_modules/@loaders.gl/parquet');
    
    // Set the WASM path to the locally served file
    const wasmPath = '/static/wasm/parquet_wasm_bg.wasm';
    
    // Test if WASM file is accessible
    const response = await fetch(wasmPath);
    if (response.ok) {
      console.log(`Setting ParquetWasmLoader WASM path: ${wasmPath}`);
      
      // Configure the default WASM URL for the loader
      if (ParquetWasmLoader.options && ParquetWasmLoader.options.parquet) {
        ParquetWasmLoader.options.parquet.wasmUrl = wasmPath;
        console.log('ParquetWasmLoader WASM path configured successfully');
        return true;
      } else {
        console.warn('ParquetWasmLoader.options.parquet not found');
        return false;
      }
    } else {
      console.error(`WASM file not accessible at ${wasmPath}:`, response.status);
      return false;
    }
  } catch (error) {
    console.error('Error configuring ParquetWasmLoader:', error);
    return false;
  }
}

// Configure WASM when the module loads
configureParquetWasmLoader()
  .then(success => {
    if (success) {
      console.log('ParquetWasmLoader WASM configuration completed successfully');
    } else {
      console.warn('ParquetWasmLoader WASM configuration failed, parquet loading may not work');
    }
  })
  .catch(error => {
    console.warn('WASM configuration error:', error.message);
  });
