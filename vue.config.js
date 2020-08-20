module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://server_url',
        ws: true,
        changeOrigin: true
      }
    }
  }
}