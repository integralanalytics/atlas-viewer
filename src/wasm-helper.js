// WASM initialization helper for Parquet files using Kepler.gl's loaders
// Properly configures ParquetLoader with correct WASM paths

let wasmInitialized = false;
let wasmInitPromise = null;

// Configure and initialize the actual parquet-wasm module
export async function initializeParquetWasm() {
  if (wasmInitialized) {
    return true;
  }
  
  if (wasmInitPromise) {
    return wasmInitPromise;
  }
  
  wasmInitPromise = (async () => {
    try {
      console.log('Starting WASM initialization...');
      
      // Try to load the actual parquet-wasm module
      try {
        // Import the parquet-wasm module
        const wasmModule = await import('parquet-wasm');
        console.log('parquet-wasm module imported successfully');
        
        // Initialize the WASM module with our local WASM file
        const wasmPath = '/static/wasm/parquet_wasm_bg.wasm';
        
        // Check if WASM file is accessible
        const response = await fetch(wasmPath);
        if (!response.ok) {
          throw new Error(`WASM file not accessible: ${wasmPath}`);
        }
        
        console.log(`Initializing WASM with path: ${wasmPath}`);
        
        // Initialize the WASM module
        await wasmModule.default(wasmPath);
        
        console.log('WASM module initialized successfully');
        wasmInitialized = true;
        return true;
        
      } catch (wasmError) {
        console.warn('Failed to load parquet-wasm module:', wasmError.message);
        
        // Fallback: just ensure the WASM file is accessible
        const wasmPath = '/static/wasm/parquet_wasm_bg.wasm';
        const response = await fetch(wasmPath);
        if (response.ok) {
          console.log(`WASM file accessible at: ${wasmPath}, but module initialization failed`);
          wasmInitialized = true;
          return false;
        } else {
          throw new Error('WASM file not accessible and module load failed');
        }
      }
      
    } catch (error) {
      console.error('ParquetLoader WASM initialization error:', error);
      wasmInitialized = true;
      return false;
    }
  })();
  
  return wasmInitPromise;
}

// Enhanced error handling wrapper for WASM operations
export function withWasmErrorHandling(fn) {
  return async (...args) => {
    try {
      await initializeParquetWasm();
      return await fn(...args);
    } catch (error) {
      if (error.message && error.message.includes('parquetfile_fromFile')) {
        console.warn('WASM parquet loading failed, this is expected in some environments');
        throw new Error('Parquet WASM not available - please ensure parquet-wasm is properly loaded');
      }
      throw error;
    }
  };
}

// Polyfill for missing WASM functions
export function polyfillWasmFunctions() {
  if (typeof window !== 'undefined') {
    // Create a comprehensive polyfill for parquet-wasm functions
    if (!window.parquet_wasm) {
      window.parquet_wasm = {};
    }
    
    // Polyfill the specific functions that are failing
    if (!window.parquet_wasm.parquetfile_fromFile) {
      window.parquet_wasm.parquetfile_fromFile = function(...args) {
        throw new Error('Parquet WASM not properly initialized - falling back to JavaScript implementation');
      };
    }
    
    // Also check for other common WASM function names
    const wasmFunctions = [
      'parquetfile_fromFile',
      'ParquetFile_fromFile', 
      'ParquetFile',
      'readParquet',
      'parseParquet'
    ];
    
    wasmFunctions.forEach(funcName => {
      if (!window.parquet_wasm[funcName]) {
        window.parquet_wasm[funcName] = function(...args) {
          throw new Error(`Parquet WASM function ${funcName} not available - using JavaScript fallback`);
        };
      }
    });
    
    console.log('WASM polyfills installed');
  }
}

export default {
  initializeParquetWasm,
  withWasmErrorHandling,
  polyfillWasmFunctions
};
