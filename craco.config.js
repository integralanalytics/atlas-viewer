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
      return webpackConfig;
    }
  }
};
