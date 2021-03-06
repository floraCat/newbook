const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
const proxy = require('./vue.proxy.config');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    productionSourceMap: false,
    runtimeCompiler: true,

    chainWebpack: config => {
        config.plugins.delete('prefetch');
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compression').use(CompressionWebpackPlugin, [{
                test: /\.js$|\.css$/,
                algorithm: 'gzip',
                threshold: 1024 * 512
            }]);
        }
    },
    devServer: {
        port: 8088,
        host: '0.0.0.0',
        https: false,
        open: true,
        proxy: proxy
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "./src/assets/styles/index.scss";'
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@views': path.resolve(__dirname, 'src/app/views'),
                '@configs': path.resolve(__dirname, 'src/app/configs'),
                '@common': path.resolve(__dirname, 'src/common'),
                '@utils': path.resolve(__dirname, 'src/common/utils')
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                _: 'lodash',
                Axios: 'axios'
            })
        ]
    }
};
