import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loadParquetFile, loadGeoJsonFile, loadSampleData } from '../utils/dataLoader';

const DataControlsContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 9999;
  background: ${props => props.theme.panelBackground};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const ControlHeader = styled.h3`
  margin: 0 0 12px 0;
  color: ${props => props.theme.titleTextColor};
  font-size: 16px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  padding: 8px 12px;
  background: ${props => props.primary ? props.theme.primaryBtnBgd : props.theme.secondaryBtnBgd};
  color: ${props => props.primary ? props.theme.primaryBtnColor : props.theme.secondaryBtnColor};
  border: 1px solid ${props => props.primary ? props.theme.primaryBtnBgd : props.theme.borderColor};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryBtnBgdHover : props.theme.secondaryBtnBgdHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  margin: 8px 0;
  padding: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 4px;
  background: ${props => props.theme.inputBgd};
  color: ${props => props.theme.inputColor};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputBorderActiveColor};
  }
`;

const StatusMessage = styled.div`
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 12px;
  background: ${props => {
    if (props.type === 'success') return props.theme.successColor || '#00a854';
    if (props.type === 'error') return props.theme.errorColor || '#d73527';
    return props.theme.warningColor || '#fa8c16';
  }};
  color: white;
`;

const DataControls = ({ onLoadSampleData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const getFriendlyErrorMessage = (error, fileName) => {
    if (error.message && error.message.includes('parquetfile_fromFile')) {
      return `Failed to load ${fileName}. This is likely due to a technical issue with the Parquet file loader or browser WASM support. Please ensure your browser supports WebAssembly and contact support if the problem persists.`;
    }
    if (error.message && error.message.includes('not recognized')) {
      return `Failed to load ${fileName}. The file format or loader is not recognized by this version of Atlas Viewer.`;
    }
    return error.message || 'Unknown error occurred.';
  };

  const handleLoadSample = async () => {
    try {
      setLoading(true);
      setStatus(null);
      if (onLoadSampleData) {
        await onLoadSampleData();
      } else {
        loadSampleData(dispatch);
      }
      setStatus({ type: 'success', message: 'Sample data loaded successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTestData = async (fileName, datasetName) => {
    try {
      setLoading(true);
      setStatus(null);
      const filePath = `/data/${fileName}`;
      if (fileName.endsWith('.parquet') || fileName.endsWith('.geoparquet')) {
        await loadParquetFile(filePath, datasetName, dispatch);
      } else if (fileName.endsWith('.geojson')) {
        await loadGeoJsonFile(filePath, datasetName, dispatch);
      }
      setStatus({ type: 'success', message: `${datasetName} loaded successfully!` });
    } catch (error) {
      setStatus({ type: 'error', message: getFriendlyErrorMessage(error, datasetName) });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      setStatus(null);
      const fileName = file.name;
      const datasetName = fileName.split('.')[0];
      const fileUrl = URL.createObjectURL(file);
      if (fileName.endsWith('.parquet') || fileName.endsWith('.geoparquet')) {
        await loadParquetFile(fileUrl, datasetName, dispatch);
      } else if (fileName.endsWith('.geojson')) {
        await loadGeoJsonFile(fileUrl, datasetName, dispatch);
      } else {
        throw new Error('Unsupported file format. Please use .parquet, .geoparquet, or .geojson files.');
      }
      setStatus({ type: 'success', message: `${fileName} uploaded successfully!` });
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setStatus({ type: 'error', message: getFriendlyErrorMessage(error, file.name) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataControlsContainer>
      <ControlHeader>Data Controls</ControlHeader>
      
      <ButtonGroup>
        <Button primary onClick={handleLoadSample} disabled={loading}>
          Load Sample Data
        </Button>
        
        <Button onClick={() => handleLoadTestData('coverage_table.parquet', 'Coverage Table')} disabled={loading}>
          Load Coverage Data
        </Button>
        
        <Button onClick={() => handleLoadTestData('coverage.geojson', 'Coverage Areas')} disabled={loading}>
          Load Coverage GeoJSON
        </Button>
        
        <Button onClick={() => handleLoadTestData('entities_analysis.geoparquet', 'Entities Analysis')} disabled={loading}>
          Load Entities Analysis
        </Button>
        
        <Button onClick={() => handleLoadTestData('features.parquet', 'Features')} disabled={loading}>
          Load Features
        </Button>
      </ButtonGroup>

      <div>
        <label htmlFor="file-upload" style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontSize: '14px', 
          fontWeight: '500',
          color: 'inherit'
        }}>
          Upload File:
        </label>
        <FileInput
          id="file-upload"
          type="file"
          accept=".parquet,.geoparquet,.geojson"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </div>

      {status && (
        <StatusMessage type={status.type}>
          {status.message}
        </StatusMessage>
      )}
    </DataControlsContainer>
  );
};

export default DataControls;
