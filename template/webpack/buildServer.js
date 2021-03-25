module.exports = {
  entry: './buildServer.js',
  mode: 'production',
  devServer: {
    contentBase: './dist',
    publicPath: '/',
    host: '0.0.0.0',
    compress: true,
    useLocalIp: true,
    historyApiFallback: true,
    open: true,
    port: 9999
  }
}
