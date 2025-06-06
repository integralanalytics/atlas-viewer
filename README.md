# Atlas Viewer

Atlas Viewer is a custom Kepler.gl v3.1.8 implementation with Integral Analytics branding, designed for visualizing geospatial data including parquet files.

## Features

- **Custom Integral Analytics Theme**: Branded color scheme and styling
- **Dynamic Logo Positioning**: Logo adapts to sidebar state
- **Enhanced Data Support**: Native support for parquet, geoparquet, and GeoJSON files
- **Production Ready**: Optimized webpack build configuration
- **Sample Data Loading**: Built-in demo datasets for testing

## Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn 1.22+
- MapBox access token (optional for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd atlas-viewer

# Install dependencies
yarn install

# Copy environment configuration
cp .env.example .env.local

# Add your MapBox token to .env.local (optional)
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### Development

```bash
# Start development server
yarn start

# Application will open at http://localhost:3000
```

### Production Build

```bash
# Create production build
yarn build

# Output will be in ./dist directory
```

## Architecture

- **Frontend**: React 18 + Redux + Styled Components
- **Mapping**: Kepler.gl v3.1.8 with custom component injection
- **Build**: Webpack 5 with custom configuration
- **Data Processing**: Enhanced parquet file support via @kepler.gl/processors

## Usage

1. **Load Sample Data**: Click "Load Sample Data" to see demo points
2. **Upload Files**: Use the file upload to load your own .parquet, .geoparquet, or .geojson files  
3. **Explore**: Use Kepler.gl's powerful visualization tools to analyze your data

## File Structure

```
src/
├── App.js                 # Main application component
├── theme.js              # Integral Analytics custom theme
├── store.js              # Redux store configuration
├── components/
│   ├── CustomLogo.js     # Dynamic logo component
│   ├── DataControls.js   # Data loading controls
│   └── HiddenPanelHeader.js # Kepler.gl header override
└── utils/
    ├── dataLoader.js     # Data loading utilities
    └── demoData.js       # Sample dataset configuration
```

## Configuration

The application uses environment variables for configuration:

- `REACT_APP_MAPBOX_TOKEN`: MapBox access token for map tiles
- `REACT_APP_APP_NAME`: Application name (default: Atlas Viewer)
- `REACT_APP_APP_VERSION`: Application version

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation for any API changes
4. Ensure production build succeeds before submitting PRs

## License

MIT License - see LICENSE file for details
