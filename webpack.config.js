const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './example/src/example.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'example/dist'),
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss|.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
