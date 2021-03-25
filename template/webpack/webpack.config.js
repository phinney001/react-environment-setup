const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const customDevServer = require('./devServer')

// 是否是生产模式
const isProduction = process.argv.includes('production')

/**
 * 获取插件
 * @returns {Array}
 */
function getPlugins() {
  // 返回值
  const result = {
    plugins: []
  }

  // 生产环境
  if (isProduction) {
    result.plugins = [
      // https://github.com/johnagan/clean-webpack-plugin
      new CleanWebpackPlugin(),
      // https://webpack.docschina.org/plugins/define-plugin
      new webpack.DefinePlugin({
        isProduction
      }),
      // https://webpack.docschina.org/plugins/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html'),
      }),
      // https://webpack.docschina.org/plugins/mini-css-extract-plugin
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
      }),
      // https://github.com/shirotech/webpack-cdn-plugin
      new WebpackCdnPlugin({
        modules: [
          { name: 'react', var: 'React', path: 'umd/react.production.min.js' },
          { name: 'react-dom', var: 'ReactDOM', path: 'umd/react-dom.production.min.js' },
          // { name: 'react-router', var: 'ReactRouter', path: 'react-router.min.js' },
          { name: 'react-router-dom', var: 'ReactRouterDOM', path: 'react-router-dom.min.js' },
          { name: 'antd', var: 'antd', path: 'antd.min.js' },
        ],
        crossOrigin: 'anonymous',
        prodUrl: 'https://cdn.bootcdn.net/ajax/libs/:name/:version/:path'
      }),
    ]
  } else {
    // 开发环境
    result.plugins = [
      // https://webpack.docschina.org/plugins/define-plugin
      new webpack.DefinePlugin({
        isProduction
      }),
      // https://webpack.docschina.org/plugins/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html'),
      }),
      // https://webpack.docschina.org/plugins/hot-module-replacement-plugin
      new webpack.HotModuleReplacementPlugin()
    ]
  }
  return result
}

/**
 * 获取优化配置
 * @returns {Array}
 */
function getOptimization() {
  // 返回值
  const result = {}
  // 生产环境
  if (isProduction) {
    result.optimization = {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      minimizer: [
        // https://webpack.docschina.org/plugins/terser-webpack-plugin
        new TerserPlugin({
          // 构建提速
          parallel: true,
          // 不将注释提取到文件
          extractComments: false,
          terserOptions: {
            // 压缩配置
            compress: {
              passes: 2
            },
            // 删除注释
            format: {
              comments: false
            }
          }
        }),
        // https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        // 第三方分离
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
        }
      }
    }
  } else {
    // 开发环境
    result.optimization = {
      runtimeChunk: true,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    }
  }
  return result
}

/**
 * 获取cssLoader
 * @param {Bollean} isModules 是否是css module
 * @returns {Array}
 */
function getCssLoader(isModules) {
  return [
    isProduction
      ? MiniCssExtractPlugin.loader
      // https://webpack.docschina.org/loaders/style-loader
      : 'style-loader',
    // https://webpack.docschina.org/loaders/css-loader
    {
      loader: 'css-loader',
      options: {
        ...(isModules && {
          modules: {
            mode: 'local',
            localIdentName: '[local]',
          }
        })
      }
    }
  ]
}

/**
 * 获取规则
 * @returns {Array}
 */
function getModule() {
  // 返回值
  const result = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              // https://github.com/TypeStrong/ts-loader
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              },
            },
          ]
        },
        {
          test: /\.css$/,
          use: getCssLoader(true)
        },
        {
          test: /\.less$/,
          use: [
            ...getCssLoader(true),
            // https://webpack.docschina.org/loaders/less-loader
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                }
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    }
  }
  return result
}

/**
 * 获取运行服务
 * @returns {Object}
 */
function getDevServer() {
  // 返回值
  const result = {}
  // 开发环境
  if (!isProduction) {
    result.devtool = 'eval-cheap-module-source-map'
    result.devServer = {
      contentBase: './',
      publicPath: '/',
      host: '0.0.0.0',
      compress: true,
      useLocalIp: true,
      historyApiFallback: true,
      open: true,
      hot: false,
      ...customDevServer
    }
  }
  return result
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: path.resolve(__dirname, './src/main.tsx'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: isProduction
      ? '[name].[contenthash:8].js'
      : '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  ...getModule(),
  ...getPlugins(),
  ...getOptimization(),
  ...getDevServer()
}
