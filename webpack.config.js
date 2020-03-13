const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = function (env, argv) {
    return {
        entry: {
            main: [
                `webpack-polyfill-injector?${JSON.stringify({
                    modules: ['./src/js/main.js']
                })}!`,
                './src/sass/main.scss'
            ],
        },

        output: {
            filename: '[name].min.js',
            publicPath: '/assets/',
            path: path.resolve('./dist/')
        },

        resolve: {
            alias: {
                
            },

            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
        },

        module: {
            rules: [
                {
                    // Load .scss files
                    test: /\.scss$/,
                    use: ['cache-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
                }
            ]
        },

        plugins: [
            new PolyfillInjectorPlugin({
                // Use a single file polyfill, otherwise we will drown in polyfill files
                singleFile: true,
                // The PolyfillInjectorPlugin uses polyfills supplied from the following repository:
                // https://github.com/Financial-Times/polyfill-library/tree/master/polyfills
                // Use at least one polyfill, otherwise the build process breaks
                polyfills: [
                    // One of the Polyfills depends on Symbol, hence this must be injected first
                    'Symbol',
                    // Remaining Polyfills should be in alphabetical order
                    'Array.from',
                    'Array.isArray',
                    'Array.prototype.includes',
                    'Array.prototype.filter',
                    'Array.prototype.map',
                    'Array.prototype.reduce',
                    'Element.prototype.closest',
                    'Element.prototype.matches',
                    'HTMLPictureElement',
                    'Map',
                    'fetch',
                ]
            }),
            new FixStyleOnlyEntriesPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            new OptimizeCssAssetsPlugin({
                // colormin has a bug that transforms rgba into incorrect hsl values
                cssProcessorOptions: {colormin: false}
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false
            }),
            // To see notifications, you need `notify-osd` installed on your system, i.e. `sudo apt install notify-osd`
            new WebpackBuildNotifierPlugin({title: "mahlerfestival.concertgebouw.nl", sound: false})
        ]
    };
};