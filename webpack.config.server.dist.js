const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  node: { console: true, __filename: true, __dirname: true },
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/
      ]
    })
  ],
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": [
              ["env", {
                "modules": false,
              }],
              "react"
            ],
            "plugins": [
              "transform-object-rest-spread"
            ],
          }
        }],
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
        use: ExtractTextPlugin.extract({
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
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        TARGET_ENV: JSON.stringify('server'),
      }
    }),    
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ]
}