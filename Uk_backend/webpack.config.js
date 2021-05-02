const webpack = require('webpack')
const slsw = require('serverless-webpack');

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    target: 'node',
    mode:'production',
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
    externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // use: {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: ['@babel/preset-env'],
          //     plugins: [
          //       ['@babel/plugin-proposal-decorators', { legacy: true }],
          //       '@babel/plugin-transform-regenerator',
          //       '@babel/plugin-transform-runtime'
          //     ]
          //   }
          // }
        }
      ]
    }
  };
})();