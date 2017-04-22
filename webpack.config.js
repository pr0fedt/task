const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: 'babel-loader'
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }, {
      test: /\.(gif|png|jpg|jpeg)$/,
      use: 'url-loader?limit=10000'
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'svg-react-loader'
      }]
    }]
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};

module.exports = config;
