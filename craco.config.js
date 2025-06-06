// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add .cjs to the list of JS extensions
      webpackConfig.resolve.extensions.push('.cjs');
      // Ensure .cjs files are treated as JS
      webpackConfig.module.rules.push({
        test: /\.cjs$/,
        type: 'javascript/auto'
      });
      
      // Suppress source map warnings for development
      if (webpackConfig.mode === 'development') {
        webpackConfig.ignoreWarnings = [
          function ignoreSourcemapsloaderWarnings(warning) {
            return (
              warning.module &&
              warning.module.resource.includes('node_modules') &&
              warning.details &&
              warning.details.includes('source-map-loader')
            );
          },
        ];
      }
      
      return webpackConfig;
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // This replaces the deprecated onBeforeSetupMiddleware and onAfterSetupMiddleware
      return middlewares;
    }
  }
};
