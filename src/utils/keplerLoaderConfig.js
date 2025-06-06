// Configure loaders.gl options for Kepler.gl's built-in Parquet support
import { setLoaderOptions } from '@loaders.gl/core';

/**
 * Initialize parquet-wasm and configure loaders.gl for Kepler.gl's built-in Parquet loader
 * This properly initializes the WASM module before it's used by @loaders.gl/parquet
 */
export const configureLoaders = async () => {
  try {
    console.log('Initializing parquet-wasm module...');
    
    // Import and initialize parquet-wasm - this is the critical step that was missing!
    const wasmModule = await import('parquet-wasm');
    
    // Initialize the WASM module to populate the wasm variable
    await wasmModule.default();
    
    console.log('Parquet WASM module initialized successfully');
    
    // Use local WASM file to avoid CORS and CDN issues
    const localWasmUrl = '/parquet_wasm_bg.wasm';
    
    try {
      console.log('Testing local WASM file:', localWasmUrl);
      const response = await fetch(localWasmUrl);
      if (!response.ok) {
        throw new Error(`Local WASM file not found: ${response.status} ${response.statusText}`);
      }
      console.log('Local WASM file found successfully');
    } catch (error) {
      console.error('Failed to load local WASM file:', error);
      throw new Error('Local WASM file is not accessible. Please ensure parquet_wasm_bg.wasm is in the public folder.');
    }    // Configure global loader options for all Parquet loaders
    setLoaderOptions({
      parquet: {
        wasmUrl: localWasmUrl
      }
    });
    
    console.log('Kepler.gl loaders configured successfully with initialized WASM module');
    return true;
  } catch (error) {
    console.error('Error configuring loaders:', error);
    return false;
  }
};

// Export for easy initialization
export default configureLoaders;
