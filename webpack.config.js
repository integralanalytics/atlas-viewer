const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: ['./src/polyfills.js', './src/index.js'],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true
    },
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.wasm'],
      alias: {
        // Ensure single instance of React
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
        'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
        // Fix process imports for ES modules
        'process/browser': 'process/browser.js',
      },
      fallback: {
        "fs": false,
        "path": "path-browserify",
        "stream": "stream-browserify", 
        "util": "util",
        "assert": "assert",
        "buffer": "buffer",
        "crypto": "crypto-browserify",
        "vm": "vm-browserify",
        "process": "process/browser.js"
      }
    },

    module: {
      rules: [
        // WASM files become emitted assets under /static/wasm/
        {
          test: /\.wasm$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/wasm/[name][ext]',
          }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        },
        // Handle parquet files
        {
          test: /\.parquet$/,
          type: 'asset/resource',
          generator: {
            filename: 'data/[name][ext]'
          }
        },
        // Handle arrow files for deck.gl
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        // Handle WASM files
        {
          test: /\.wasm$/,
          type: 'asset/resource'
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './assets/favicon.png'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        'process.browser': true,
        'process.env.BROWSER': true,
        global: 'globalThis'
      })
    ],

    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'assets'),
          publicPath: '/assets'
        },
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/'
        },
        {
          directory: path.join(__dirname, 'tests/data'),
          publicPath: '/data'
        }
      ],
      compress: true,
      port: 3000,
      hot: false, // Disable hot reload to prevent WebSocket issues
      liveReload: false, // Disable live reload
      open: false, // Don't auto-open in codespace
      historyApiFallback: true,
      allowedHosts: 'all', // Allow external hosts
      host: '0.0.0.0', // Bind to all interfaces
      // Completely disable WebSocket to prevent connection failures
      client: false,
      webSocketServer: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },

    // Optimization for production
    optimization: {
      splitChunks: isProduction ? {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          kepler: {
            test: /[\\/]node_modules[\\/]@kepler\.gl[\\/]/,
            name: 'kepler',
            chunks: 'all'
          }
        }
      } : false
    }
  };
};
