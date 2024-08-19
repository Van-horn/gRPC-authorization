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
                  transpileOnly: true,
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
      '@grpc/grpc-js': 'commonjs2 @grpc/grpc-js',
      '@grpc/proto-loader': 'commonjs2 @grpc/proto-loader',
   },
}
