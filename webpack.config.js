const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const config = require('config');

module.exports = {
  mode: (process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
  entry: './src/index.js',
  output: {
    library: 'ghEditor',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== "undefined" ? self : this)',
    libraryExport: 'default',
    path: path.resolve(__dirname, '@gheditor/dist'),
    filename: 'main.js',
    publicPath: config.get('publicPath'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss|.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    open: config.get('open'),
  },
  devtool: (process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map'),
};