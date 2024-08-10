const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './.env') })
const protoFile = path.join(__dirname, '../node_modules', 'proto-for-store', 'tokens', '.proto')

const tokensController = require('./controllers/tokens-controller')

const packageDefinition = protoLoader.loadSync(protoFile, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const {
   tokens: { GenerateTokens, ValidAccessToken, ValidRefreshToken },
} = grpc.loadPackageDefinition(packageDefinition)

async function main(): Promise<number> {
   try {
      const server = new grpc.Server()
      server.addService(GenerateTokens.service, { generateTokens: tokensController.generateTokens })
      server.addService(ValidAccessToken.service, { validAccessToken: tokensController.validAccessToken })
      server.addService(ValidRefreshToken.service, { validRefreshToken: tokensController.validRefreshToken })

      await server.bindAsync(`${process.env.HOST ?? "0.0.0.0"}:${process.env.PORT ?? 8080}`, grpc.ServerCredentials.createInsecure(), () => {
         console.log('tokens-microservice')
         console.log(process.env.HOST)
      })
      return 0
   } catch (error) {
      console.error('Error starting server:', error)

      return 1
   }
}
main()
