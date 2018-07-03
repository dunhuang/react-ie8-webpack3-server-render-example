const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin');

const port = process.env.PORT || 40000
const devServerPort = parseInt(port, 10) + 1
const nodeArgs = [];

// Add --inspect or --inspect-brk flag when enabled
if (process.env.INSPECT_BRK_ENABLED) {
  nodeArgs.push('--inspect-brk');
} else if (process.env.INSPECT_ENABLED) {
  nodeArgs.push('--inspect');
}

module.exports = {
  entry: ['webpack/hot/poll?300','./src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'server.js',
    publicPath: `http://localhost:${devServerPort}/`,
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  node: { console: true, __filename: true, __dirname: true },
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: [
        'webpack/hot/poll?300',
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,
      ]
    })
  ],
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        loader: 'babel-loader',
        options:{ babelrc: true, cacheDirectory: true},
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, './src')]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'webpack/hot/poll': path.resolve(__dirname, 'node_modules/webpack/hot/poll'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        TARGET_ENV: JSON.stringify('server'),
      }
    }),    
    // This makes debugging much easier as webpack will add filenames to
    // modules
    //new webpack.NamedModulesPlugin(),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    // Add hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    // Supress errors to console (we use our own logger)
    new webpack.NoEmitOnErrorsPlugin(),
    // Automatically start the server when we are done compiling
    new StartServerPlugin({
      name: 'server.js',
      nodeArgs,
    }),
    // Ignore assets.json to avoid infinite recompile bug
    new webpack.WatchIgnorePlugin([path.resolve(__dirname, 'dist/assets.json')]),
    new FriendlyErrorsPlugin({
      verbose: false,
      target: 'node',
      onSuccessMessage: `Your application is running at http://localhost:${port}`,
    }),
  ]
}