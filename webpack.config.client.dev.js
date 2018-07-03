const path = require('path')
const webpack = require('webpack')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const AssetsPlugin = require('assets-webpack-plugin');

const port = process.env.PORT || 40000
const devServerPort = parseInt(port, 10) + 1

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {polyfill:'babel-polyfill', bundle: [ './scripts/webpackHotDevClient.js','./src/client.js']},
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].js',
    publicPath: `http://localhost:${devServerPort}/`
  },
  target: 'web',
  devServer: {
    disableHostCheck: true,
    clientLogLevel: 'none',
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    host: 'localhost',
    hot: true,
    noInfo: true,
    overlay: false,
    port: devServerPort,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    setup(app) {
      app.use(errorOverlayMiddleware())
    }
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', options:{ babelrc: true, cacheDirectory: true}, include: path.resolve(__dirname,'src')},
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
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, './src')],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'webpack/hot/poll': require.resolve('webpack/hot/poll'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PORT: port,
      }
    }),    
    new webpack.NamedModulesPlugin(),
    new AssetsPlugin({
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets.json',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
}