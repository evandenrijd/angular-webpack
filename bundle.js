var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.workflow.config.js');
var path = require('path');
var fs = require('fs');
var mainPath = path.resolve(__dirname, 'src', 'app', 'app.module.js');

module.exports = function () {
  var bundleStart = null;
  var compiler = Webpack(webpackConfig);

  compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });

  var bundler = new WebpackDevServer(compiler, {
    // We need to tell Webpack to serve our bundled application
    // from the dist path inside the public-directory. When proxying:
    // http://localhost:3000/dist -> http://localhost:8080/dist
    publicPath: '/dist/',
    hot: true,

    // The rest is terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });

  bundler.listen(8080, 'localhost', function () {
    console.log('Bundling project, please wait...');
  });

};
