const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './.env') })
const { ApiError } = require('shared-for-store')
const protoFile = path.resolve(__dirname, '../node_modules/proto-for-store/src/tokens/.proto')

import ITokensController from './controllers/tokens-controller'
const tokensController = require('./controllers/tokens-controller') as ITokensController.TokensController

const packageDefinition = protoLoader.loadSync(protoFile, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})

const { GenerateTokens, ValidAccessToken, ValidRefreshToken } = grpc.loadPackageDefinition(packageDefinition).Tokens

async function main(): Promise<number> {
   try {
      const server = new grpc.Server()
      server.addService(GenerateTokens.service, { generateTokens: tokensController.generateTokens })
      server.addService(ValidAccessToken.service, { validAccessToken: tokensController.validAccessToken })
      server.addService(ValidRefreshToken.service, {
         validRefreshToken: tokensController.validRefreshToken,
      })

      await server.bindAsync(
         `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         grpc.ServerCredentials.createInsecure(),
         () => {
            console.log('tokens-microservice')
         },
      )

      return 0
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
