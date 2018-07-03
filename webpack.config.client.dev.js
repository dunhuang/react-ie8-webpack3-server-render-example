const path = require('path')
const es3ifyPlugin = require('es3ify-webpack-plugin')
const webpack = require('webpack')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const AssetsPlugin = require('assets-webpack-plugin');
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin');

const port = process.env.PORT || 40000
const devServerPort = parseInt(port, 10) + 1

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {client: [ './scripts/webpackHotDevClient.js','./node_modules/babel-polyfill/lib/index.js','./src/client.js']},
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/bundle.js',
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
    //inline: true,
    hot: true,
    noInfo: true,
    overlay: false,
    port: 40001,
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
      { test: /\.jsx?$/, loader: 'babel-loader', options:{ babelrc: true, cacheDirectory: true}, exclude:/\/node_modules\//},
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
    new es3ifyPlugin()
  ]
}