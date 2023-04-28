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
        externals:{
            'vfluentdesign':{
                "commonjs":"vfluentdesign",
                "commonjs2":"vfluentdesign",
                "root":"VFluent"
            }
        }
    },
    lintOnSave: true,
};
