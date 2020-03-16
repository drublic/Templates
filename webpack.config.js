const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: "development",
  entry: {
    Templates: [
      path.resolve('./Templates.js'),
    ],
  },
  cache: false,
  output: {
    path: path.resolve('dist/'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  }
}
