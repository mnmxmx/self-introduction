var webpack = require('webpack');
var config = require('./gulp/config');

module.exports = {
  entry: {
    "./assets/js/app": './'+ config.PATH.SRC +'assets/js/app.js',
  },
  output: {
    // pathはgulp/tasks/javascript.jsを参照
    filename: '[name].js'
  },
  externals: [
    {
      //jquery: 'jQuery',
      //imagesloaded: 'imagesLoaded',
      //modernizr: 'Modernizr'
    }
  ],
  resolve: {
    extensions: ['', '.js', '.scss', '.sass']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [
      {
       test: /\.js$/,
       loader: 'babel-loader',
       exclude: /node_modules/
       // query:
       //  {
       //    presets: ['es2015','stage-0']
       //  }
      },
      // gulp/tasks/javascript.jsで追加
      //{ test: /\.js$/, loader: "strip-loader?strip[]=console.log" },
      //{
      //  test: /\.js(x?)$/,
      //  exclude: /node_modules/,
      //  loader: 'babel',
      //  query: {
      //  presets: ['es2015']
      // }
      //}
      //{
      //  test: /\.js(x?)$/,
      //  exclude: /node_modules/,
      //  loader: 'eslint'
      //},
      //{
      //  test: /\.(scss|sass)$/,
      //  exclude: /node_modules/,
      //  loader: 'sass-variables'
      //},
      //{
      //  test: /\.vue/,
      //  loader: 'vue'
      //},
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html'
      }
    ]
  },

  eslint: {
    configFile: '.eslintrc',
    failOnError: true,
    emitError: true
  }
};