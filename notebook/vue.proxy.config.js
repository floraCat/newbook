module.exports = {
    '/nb': {
        target: 'http://localhost:8077',
        changeOrigin: false,
        pathRewrite: {
            '^/nb': '/nb'
        }
    }
};
