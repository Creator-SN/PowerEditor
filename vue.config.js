const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const debug = process.env.NODE_ENV != "production";

module.exports = {
    pages: {
        index: {
            entry: 'src/index.js',
        },
    },
    css: {
        // Separate StyleSheet
        extract: true,
        modules: false,
        sourceMap: false,
    },
    lintOnSave: true,
}