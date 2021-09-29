module.exports = {
    pages: {
        index: {
            entry: 'src/index.js',
        },
    },
    css: {
        // Separate StyleSheet
        extract: true,
        requireModuleExtension: false,
        sourceMap: false,
    },
    configureWebpack: {
        output: {
            libraryExport: 'default',
        },
    },
    lintOnSave: true,
};
