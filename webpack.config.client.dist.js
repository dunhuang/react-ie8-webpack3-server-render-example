const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const es3ifyPlugin = require('es3ify-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

module.exports = {
  entry: {
    polyfill: './node_modules/babel-polyfill/lib/index.js', 
    bundle: './src/client.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, 
        loader: 'babel-loader', 
        options: {
          "presets": [
            ["env", {
              "module": false,
              "loose": true,
              "targets": {
                "browsers": [
                  "ie >= 8",
                  "Chrome >= 21",
                  "Firefox >= 1",
                  "Edge >= 13",
                  "last 3 versions"
                ]
              }
            }],
            "react"
          ],
          "plugins": [
            "transform-object-rest-spread",
            "react-loadable/babel",
            "syntax-dynamic-import"
          ]
        },
        include: path.resolve(__dirname,'src')
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
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
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new AssetsPlugin({
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets.json',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),    
    new CleanWebpackPlugin(['dist'], {root: __dirname}),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist/public'),
        ignore: ['.*']
      }
    ]),
    new es3ifyPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        screw_ie8: false,
        except: ['$']
      },
      mangleProperties: {
        screw_ie8: false
      },
      compress:{
        screw_ie8: false,
        warnings: false
      },
      output: {
        screw_ie8: false
      },
      support_ie8: true
    }),
    new ExtractTextPlugin({
      filename: 'style_[chunkhash:8].css'
    }),
    new ReactLoadablePlugin({
      filename: './dist/react-loadable.json',
    })
  ]
}