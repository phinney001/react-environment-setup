module.exports = {
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://192.168.1.99:8083',
      changeOrigin: true,
      pathRewrite: {
        '^': ''
      }
    }
  }
}