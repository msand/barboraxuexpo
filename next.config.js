// @generated: @expo/next-adapter@2.0.0-beta.9
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
require('dotenv').config();

const withTranspileModules = require('next-transpile-modules');
const { withExpo } = require('@expo/next-adapter');
const routes = require('./routes');

module.exports = withExpo(
  withTranspileModules({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      // Important: return the modified config
      config.module.rules.push({
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: '@svgr/webpack',
          },
        ],
      });
      return config;
    },
    env: {
      DATO_API_TOKEN: process.env.DATO_API_TOKEN, // Pass through env variables
    },
    transpileModules: ['react-native-svg', 'styled-components/native'],
    projectRoot: __dirname,
    exportPathMap: routes,
  }),
);
