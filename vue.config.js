module.exports = {
    pages: {
        index: {
            entry: 'src/index.js',
        },
    },
    css: {
        // Separate StyleSheet
        extract: true,
        requireModuleExtension: true,
        sourceMap: false,
    },
    productionSourceMap: false,
    configureWebpack: {
        // devtool: "source-map",
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
