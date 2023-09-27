const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // Specify your entry point
  output: {
    path: path.resolve(__dirname, 'dist'), // Specify your output directory
    filename: 'bundle.js', // Specify your output filename
  },
  module: {
    rules: [
      // Add any necessary loaders for your project's JavaScript/TypeScript files
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    // Use dotenv-webpack to load environment variables from a .env file
    new Dotenv(),
  ],
};
