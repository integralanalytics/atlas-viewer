// Standard Kepler.gl Parquet file loader component
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addDataToMap } from '@kepler.gl/actions';
import { isValidParquetFile, previewParquetFile } from '../utils/parquetHelper';

const ParquetFileLoader = ({ mapId = 'atlas-viewer' }) => {
  const dispatch = useDispatch();

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!isValidParquetFile(file)) {
      alert('Please select a valid Parquet file (.parquet or .pq)');
      return;
    }

    try {
      console.log('Loading Parquet file:', file.name);

      // Optional: Preview the file first
      const preview = await previewParquetFile(file, 10);
      console.log('Parquet file preview:', preview);

      // Use Kepler.gl's standard data loading approach
      // This leverages the registered loaders automatically
      dispatch(addDataToMap({
        datasets: {
          info: {
            label: file.name.replace(/\.(parquet|pq)$/i, ''),
            id: `parquet-${Date.now()}`
          },
          data: file // Pass raw file - Kepler.gl will process it
        },
        options: {
          centerMap: true,
          readOnly: false,
          keepExistingConfig: false
        },
        config: {} // Let Kepler.gl auto-generate config
      }));

      console.log('Parquet file loaded successfully into Kepler.gl');
    } catch (error) {
      console.error('Error loading Parquet file:', error);
      alert(`Failed to load Parquet file: ${error.message}`);
    }
  }, [dispatch, mapId]);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <label style={{
        color: 'white',
        cursor: 'pointer',
        padding: '8px 16px',
        background: '#339AF0',
        borderRadius: '4px',
        display: 'inline-block'
      }}>
        Load Parquet File
        <input
          type="file"
          accept=".parquet,.pq"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

export default ParquetFileLoader;
