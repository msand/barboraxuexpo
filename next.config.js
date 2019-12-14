// @generated: @expo/next-adapter@2.0.0-beta.9
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
require('dotenv').config();
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  env: {
    DATO_API_TOKEN: process.env.DATO_API_TOKEN, // Pass through env variables
  },
  projectRoot: __dirname,
});
