module.exports = {
    '/nb': {
        target: 'http://localhost:3001',
        changeOrigin: false,
        pathRewrite: {
            '^/nb': ''
        }
    }
};
