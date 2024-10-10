const path = require('path')

module.exports = {
   mode: 'production',
   entry: './src/index.ts',
   target: 'node',
   output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      libraryTarget: 'umd',
   },
   optimization: {
      minimize: true,
      usedExports: true,
   },
   resolve: {
      extensions: ['.ts', '.js'],
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /\.test.ts$/,
            use: {
               loader: 'ts-loader',
               options: {
                  transpileOnly: false,
               },
            },
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
               },
            },
         },
      ],
   },
   externals: {
      '@grpc/grpc-js': '@grpc/grpc-js',
      pg: 'pg',
      'pg-hstore': 'pg-hstore',
      'proto-for-store': 'proto-for-store',
      sequelize: 'sequelize',
      'shared-for-store': 'shared-for-store',
      dotenv: 'dotenv',
      'db-for-store': 'db-for-store',
   },
}
