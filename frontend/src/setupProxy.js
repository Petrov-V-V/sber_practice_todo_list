const { createProxyMiddleware } = require('http-proxy-middleware');
const TARGET_API_URL = 'http://localhost:8080';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: TARGET_API_URL,
      changeOrigin: true,
    })
  );
  
  app.use(
    '/categories',
    createProxyMiddleware({
      target: TARGET_API_URL,
      changeOrigin: true,
    })
  );
  
  app.use(
    '/tasks',
    createProxyMiddleware({
      target: TARGET_API_URL,
      changeOrigin: true,
    })
  );
};