const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      content: path.join(__dirname, 'src', 'content.js'),
      index: path.join(__dirname, 'src', 'index.js'),
      background: path.join(__dirname, 'src', 'background.js'),
      popup: path.join(__dirname, 'src', 'popup.js'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      // new ESLintPlugin({
      //   extensions: ['js', 'jsx'], // Extensiones a verificar
      //   exclude: ['node_modules'], // Excluir directorios
      //   fix: true, // Auto corregir problemas
      // }),
      ...(isProduction ? [new ZipPlugin({
          filename: 'ChatGptRedactor.zip',
          compression: 'DEFLATE',
          path: '../dist-zip',
        })] : []),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(__dirname, 'src', 'manifest.json'), to: path.join(__dirname, 'dist', 'manifest.json') },
          { from: path.join(__dirname, 'src', 'ding.mp3'), to: path.join(__dirname, 'dist', 'ding.mp3') },
          { from: path.join(__dirname, 'src', 'icon16.png'), to: path.join(__dirname, 'dist', 'icon16.png') },
          { from: path.join(__dirname, 'src', 'icon48.png'), to: path.join(__dirname, 'dist', 'icon48.png') },
          { from: path.join(__dirname, 'src', 'icon128.png'), to: path.join(__dirname, 'dist', 'icon128.png') },
          { from: path.join(__dirname, 'src', 'options.html'), to: path.join(__dirname, 'dist', 'options.html') },
          { from: path.join(__dirname, 'src', 'popup.html'), to: path.join(__dirname, 'dist', 'popup.html') },
          { from: path.join(__dirname, 'src', 'images'), to: path.join(__dirname, 'dist', 'images') },
        ],
      }),
    ],
  };
}
