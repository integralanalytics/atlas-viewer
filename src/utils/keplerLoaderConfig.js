// Custom loader configuration for Kepler.gl
import { registerLoaders } from '@loaders.gl/core';
import { ParquetLoader } from '@loaders.gl/parquet';
import { ArrowLoader } from '@loaders.gl/arrow';
import { JSONLoader } from '@loaders.gl/json';
import { CSVLoader } from '@loaders.gl/csv';

// Enhanced loader registration with proper options
export const configureKeplerLoaders = () => {
  const loaders = [
    {
      ...CSVLoader,
      options: {
        csv: {
          delimiter: ',',
          header: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            // Handle numeric fields
            if (field === 'lat' || field === 'lng' || field === 'latitude' || field === 'longitude') {
              return parseFloat(value) || 0;
            }
            return value;
          }
        }
      }
    },
    {
      ...JSONLoader,
      options: {
        json: {
          jsonpath: '$'
        }
      }
    },
    {
      ...ParquetLoader,
      options: {
        parquet: {
          preserveTypedArrays: true
        }
      }
    },
    {
      ...ArrowLoader,
      options: {
        arrow: {
          preserveTypedArrays: true
        }
      }
    }
  ];

  registerLoaders(loaders);
  
  console.log('Kepler.gl loaders configured:', loaders.map(l => l.name || l.id));
  
  return loaders;
};

// Export individual loaders for debugging
export { ParquetLoader, ArrowLoader, JSONLoader, CSVLoader };
