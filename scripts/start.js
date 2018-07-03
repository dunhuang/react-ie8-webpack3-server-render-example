'use strict';

process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const printErrors = require('razzle-dev-utils/printErrors');
const logger = require('razzle-dev-utils/logger');
const clientConfig = require('../webpack.config.client.dev');
const serverConfig = require('../webpack.config.server.dev');
const setPorts = require('razzle-dev-utils/setPorts');

process.noDeprecation = true; // turns off that loadQuery clutter.

const assetsPath = path.resolve(process.cwd(), 'dist/assets.json')

function main() {
  // Optimistically, we make the console look exactly like the output of our
  // FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
  // clearConsole();
  logger.start('Compiling...');

  fs.removeSync(assetsPath);

  const serverCompiler = compile(serverConfig);

  // Start our server webpack instance in watch mode.
  serverCompiler.watch(
    {
      quiet: true,
      stats: 'none',
    },
    /* eslint-disable no-unused-vars */
    stats => {}
  );


  // Compile our assets with webpack
  const clientCompiler = compile(clientConfig);

  // Create a new instance of Webpack-dev-server for our client assets.
  // This will actually run on a different port than the users app.
  const clientDevServer = new devServer(clientCompiler, clientConfig.devServer);
  
  // Start Webpack-dev-server
  clientDevServer.listen(
    (process.env.PORT && parseInt(process.env.PORT) + 1) || 40001,
    err => {
      if (err) {
        logger.error(err);
      }
    }
  );
}

// Webpack compile in a try-catch
function compile(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    printErrors('Failed to compile.', [e]);
    process.exit(1);
  }
  return compiler;
}

setPorts()
  .then(main)
  .catch(console.error);