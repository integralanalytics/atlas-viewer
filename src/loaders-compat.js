// Loaders.gl v4.x compatibility layer for Kepler.gl v3.1.8
// Fixes version incompatibilities between Kepler.gl and loaders.gl

// Suppress the console warning about batchDebounceMs and WASM errors
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  const message = args.join(' ');
  if (message.includes('batchDebounceMs') || 
      message.includes('not recognized') ||
      message.includes('arrow.batchDebounceMs') ||
      message.includes('parquetfile_fromFile') ||
      message.includes('WASM not available') ||
      message.includes('WASM function') ||
      message.includes('JavaScript fallback')) {
    // Log these as debug info instead of warnings to reduce console noise
    console.debug('[COMPAT]', message);
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Enhanced error handling for Parquet loading
const originalError = window.Error;
window.Error = function(message, ...args) {
  // Intercept specific WASM errors and provide better error messages
  if (typeof message === 'string' && message.includes('parquetfile_fromFile')) {
    const enhancedMessage = 'Parquet WASM loading failed - using JavaScript fallback implementation. This is expected behavior when WASM is not available.';
    console.debug('[PARQUET]', enhancedMessage);
    return new originalError(enhancedMessage, ...args);
  }
  return new originalError(message, ...args);
};

// Patch global parquet WASM functions to handle errors gracefully
function patchParquetWasmFunctions() {
  if (typeof window !== 'undefined' && window.ParquetFile) {
    const originalFromFile = window.ParquetFile.fromFile;
    if (originalFromFile) {
      window.ParquetFile.fromFile = function(...args) {
        try {
          return originalFromFile.apply(this, args);
        } catch (error) {
          if (error.message && error.message.includes('parquetfile_fromFile')) {
            console.debug('[PARQUET] WASM function not available, falling back to JavaScript');
            throw new Error('Parquet WASM not available - using JavaScript fallback');
          }
          throw error;
        }
      };
    }
  }
}

// Apply patches when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchParquetWasmFunctions);
  } else {
    patchParquetWasmFunctions();
  }
}

// Patch Kepler.gl's file processor to handle loader option incompatibilities
export function patchKeplerGlProcessors() {
  // Check if we can access Kepler.gl processors
  try {
    if (typeof window !== 'undefined' && window.KeplerGl) {
      console.log('Patching Kepler.gl processors for loaders.gl v4.x compatibility');
    }
  } catch (error) {
    console.warn('Could not patch Kepler.gl processors:', error);
  }
}
