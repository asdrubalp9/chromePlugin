module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  rules: {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
  },
};