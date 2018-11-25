// Important modules this config uses
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: [path.join(process.cwd(), 'app/app.js')],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  optimization: {
    minimize: true,
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: { chunks: 'all' },
    runtimeChunk: true,
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      autoUpdate: 1000 * 60 * 1,
      relativePaths: false,
      publicPath: '/',
      appShell: '/',

      // No need to cache .htaccess. See http://mxs.is/googmp,
      // this is applied before any match in `caches` section
      excludes: ['.htaccess'],

      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ['*.chunk.js'],
        // additional: [':externals:'],
        // optional: ['*.chunk.js']
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,



      // https://www.seunghunlee.net/auth/facebook/callback?code=AQA_tOcxNhNb9znWKcvDIVPksa-gwhTAVdznKbsz5gVqBqTN4BZIVA_h7x6UByjZZnptsurPcs1zpH6A9Yj2hFl0q-QnrXd-oF_OfwoTXgV_6UhLfEu4EZxXoRHEtGQbdocJtbcAM1AnknAm_rL0BuRpHKb_MPyZoJrcQeF-0ClX6R8ckaOERy1oSd4Oc93YYe2DmtMC-vPb2i-_VljCplFWU41Jd6m5ELTO38slThgcK8UjE23gNu-cnecQIN6Hi771EzZ9JFAW1Z6zDu_eGeZbuBEJ9b2w9cxHc5ef3iH2PeEUNBbbehtNfHTBvQegDlfn16OEwy0akfIjgLhW_AwJ#_=_
      rewrites: function(asset) {
          if (asset.endsWith('#_=_')) {
            return `https://www.seunghunlee.net/auth/facebook` + asset;
            // return `http://localhost:3000/auth/facebook` + asset;
          }
          // else {
          //   return 'https://www.seunghunlee.net/' + asset;
          //   // return 'http://localhost:3000/' + asset;
          // }

          return asset;
      },
      // cacheMaps: [
      //   {
      //     match: function(requestUrl) {
      //       return new URL('/', location);
      //     },
      //     requestTypes: ['navigate']
      //   }
      // ],

      ServiceWorker: {
        events: true,
      },
      // externals: [
      //   '/',
      //   '/auth/facebook',
      //   '/auth/google'
      // ],
      // responseStrategy: 'network-first',
    }),

    new WebpackPwaManifest({
      name: 'SeunghunLee Software',
      short_name: 'SeunghunLee Software',
      description: 'SeunghunLee Software',
      background_color: '#fafafa',
      theme_color: '#b1624d',
      icons: [
        {
          src: path.resolve('app/images/ms-icon-310x310.png'),
          sizes: [72, 96, 120, 128, 144, 152, 167, 180, 192, 384, 512],
        },
      ],
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});
