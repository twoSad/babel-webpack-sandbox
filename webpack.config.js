const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {
  const { mode = 'development' } = env;
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getStylesLoader = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader',
    ];
  };

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        title: 'webpack-sandbox',
        buildTime: new Date().toISOString(),
        template: 'public/index.html',
      }),
    ];
    if (isProd) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: 'main-[hash:7].css',
        })
      );
    }
    return plugins;
  };

  return {
    mode: isProd ? 'production' : isDev && 'development',

    output: {
      filename: isProd ? 'main-[hash:8].js' : undefined,
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // Loading images
        {
          test: /\.(png|jpg|jpeg|gif|ico|)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
                name: '[name]-[sha1:hash:7].[ext]',
              },
            },
          ],
        },
        // Loading fonts
        {
          test: /\.(ttf|otf|eot|woff|woff2|)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'fonts',
                name: '[name].[ext]',
              },
            },
          ],
        },
        // Loading css
        {
          test: /\.(css)$/,
          use: getStylesLoader(),
        },
        // Loading sass/scss
        {
          test: /\.(s[ca]ss)$/,
          use: [...getStylesLoader(), 'sass-loader'],
        },
      ],
    },
    plugins: getPlugins(),

    devServer: {
      open: true,
    },
  };
};
