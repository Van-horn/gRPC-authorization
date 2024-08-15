const path = require('path')
const nodeExternals = require('webpack-node-externals')

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
   resolve: {
      extensions: ['.ts', '.js'],
      alias: {
         pg: 'pg/lib/index.js',
      },
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /\.test.ts$/,
            use: {
               loader: 'ts-loader',
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
   externals: [nodeExternals(), '@grpc/grpc-js', '@grpc/proto-loader'],
}
