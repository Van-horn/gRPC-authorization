const path = require('path')

module.exports = {
   mode: 'production',
   entry: './src/index.ts',
   target: 'node',
   output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      clean: true,
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
      dotenv: 'dotenv',
      'shared-for-store': 'shared-for-store',
      'proto-for-store': 'proto-for-store',
   },
   optimization: {
      minimize: true,
      usedExports: true,
   },
   devtool: 'source-map',
}
