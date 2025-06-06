import Papa from 'papaparse';

/**
 * Process Parquet files (including GeoParquet)
 * For now, we'll let Kepler.gl handle parquet files directly
 */
export const processParquetFile = async (file, fileName) => {
  try {
    // Return the raw file and let Kepler.gl handle the parsing
    // Kepler.gl has built-in support for parquet files
    return {
      data: file,
      config: null
    };
  } catch (error) {
    console.error('Error processing parquet file:', error);
    throw new Error(`Failed to process parquet file: ${error.message}`);
  }
};

/**
 * Process CSV files
 */
export const processCsvFile = async (file, fileName) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }

        const data = results.data;
        const columns = results.meta.fields || [];

        const config = {
          version: 'v1',
          config: {
            visState: {
              filters: [],
              layers: [
                {
                  id: `${fileName}_layer`,
                  type: 'point',
                  config: {
                    dataId: fileName.replace(/\.[^/.]+$/, ""),
                    label: fileName,
                    color: [23, 184, 190],
                    columns: {
                      lat: findGeoColumn(columns, ['lat', 'latitude', 'y']),
                      lng: findGeoColumn(columns, ['lng', 'lon', 'longitude', 'x']),
                      altitude: findGeoColumn(columns, ['altitude', 'elevation', 'z'])
                    },
                    isVisible: true
                  }
                }
              ]
            }
          }
        };

        resolve({ data, config });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      }
    });
  });
};

/**
 * Process GeoJSON files
 */
export const processGeoJsonFile = async (file, fileName) => {
  try {
    const text = await file.text();
    const geojsonData = JSON.parse(text);
    
    // Validate GeoJSON structure
    if (!geojsonData.type || (geojsonData.type !== 'FeatureCollection' && geojsonData.type !== 'Feature')) {
      throw new Error('Invalid GeoJSON format');
    }

    const config = {
      version: 'v1',
      config: {
        visState: {
          filters: [],
          layers: [
            {
              id: `${fileName}_layer`,
              type: 'geojson',
              config: {
                dataId: fileName.replace(/\.[^/.]+$/, ""),
                label: fileName,
                color: [23, 184, 190],
                isVisible: true,
                visConfig: {
                  opacity: 0.8,
                  strokeOpacity: 0.8,
                  thickness: 0.5,
                  strokeColor: [23, 184, 190],
                  colorRange: {
                    name: 'Global Warming',
                    type: 'sequential',
                    category: 'Uber',
                    colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                  },
                  strokeColorRange: {
                    name: 'Global Warming',
                    type: 'sequential', 
                    category: 'Uber',
                    colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                  },
                  radius: 10,
                  filled: true,
                  stroked: true,
                  extruded: false,
                  wireframe: false
                }
              }
            }
          ]
        }
      }
    };

    return { data: geojsonData, config };
  } catch (error) {
    console.error('Error processing GeoJSON file:', error);
    throw new Error(`Failed to process GeoJSON file: ${error.message}`);
  }
};

/**
 * Helper function to find geographic columns
 */
const findGeoColumn = (columns, possibleNames) => {
  for (const name of possibleNames) {
    const found = columns.find(col => 
      col.toLowerCase().includes(name.toLowerCase())
    );
    if (found) return found;
  }
  return null;
};

/**
 * Detect file type based on file extension or content
 */
export const detectFileType = (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.parquet')) {
    return 'parquet';
  } else if (fileName.endsWith('.geoparquet')) {
    return 'geoparquet';
  } else if (fileName.endsWith('.csv')) {
    return 'csv';
  } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
    return 'geojson';
  } else {
    return 'unknown';
  }
};

/**
 * Generic file processor that detects type and processes accordingly
 */
export const processFile = async (file) => {
  const fileType = detectFileType(file);
  const fileName = file.name;

  switch (fileType) {
    case 'parquet':
    case 'geoparquet':
      return await processParquetFile(file, fileName);
    case 'csv':
      return await processCsvFile(file, fileName);
    case 'geojson':
      return await processGeoJsonFile(file, fileName);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};
