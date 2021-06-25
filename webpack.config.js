const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './public/js/startup.js'),
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'bundled.js',
  },
  mode: 'development'
}

