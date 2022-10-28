/* eslint-disable quotes */
/* eslint-disable indent */

const Package = require("./package.json");

process.env.VUE_APP_VERSION = Package.version;
process.env.VUE_APP_NAME = Package.name;
process.env.VUE_APP_WEB = Package.homepage;
process.env.VUE_APP_REPO = Package.repository;

module.exports = {
    // VS Code Chrome Debugging
    configureWebpack: {
        devtool: 'source-map'
    },
    chainWebpack: (config) => {
        // Step-Files sollen nicht vorgeladen werden
        config
            .plugin("prefetch")
            .tap((options) => {
                options[0].fileBlacklist = options[0].fileBlacklist || [];
                // alle ungenutzte Sprachdateien
                options[0].fileBlacklist.push(/\.locale[.~]*.*\.js/);
                // alle geteilte JS-Dateien mit '.step', '.restricted' enden
                options[0].fileBlacklist.push(/\.step[.~]*.*\.(js|css|css.map)/);
                options[0].fileBlacklist.push(/\.restricted[.~]*.*\.(js|css|css.map)/);
                // pdfWorker.js
                options[0].fileBlacklist.push(/([wW])orker[.~]*.*\.js/);
                return options;
            });

        config.module
            .rule("js")
            .exclude
                .add(/\.worker\.js$/);
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .exclude
                .add(/pdf\.worker\.js$/)
                .end()
            .use("worker-loader")
                .loader("worker-loader")
                .end();
    },
    pluginOptions: {
        i18n: {
            locale: "de",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: true
        }
    },
    transpileDependencies: [
        "vuetify",
        "vuex-persist"
    ],
    productionSourceMap: false,
    css: {
        sourceMap: true
    },
};
