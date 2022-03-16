const path = require('path')
const webpack = require("webpack")

module.exports = {
    base: '/PowerEditor/',
    title: 'PowerEditor',
    description: 'Power Editor power by tiptap (prosemirror toolkit)',
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, '../../src')
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
        ]
    },
    themeConfig: {
        logo: "https://raw.githubusercontent.com/Creator-SN/PowerEditor/master/src/modules/editor/src/assets/logo.svg",
    }
}