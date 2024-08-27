const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './.env') })
const { ApiError } = require('shared-for-store')

const protoSlaveServer = path.join(__dirname, '../node_modules', 'proto-for-store', 'src', 'slave-server', '.proto')
const protoMasterServer = path.join(__dirname, '../node_modules', 'proto-for-store', 'src', 'master-server', '.proto')
const protoTokens = path.join(__dirname, '../node_modules', 'proto-for-store', 'src', 'tokens', '.proto')
const protoAuth = path.join(__dirname, '../node_modules', 'proto-for-store', 'src', 'authorization', '.proto')

const userController = require('./controllers/user-controller')

const packageDefinitionSlaveServer = protoLoader.loadSync(protoSlaveServer, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const packageDefinitionMasterServer = protoLoader.loadSync(protoMasterServer, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const packageDefinitionTokens = protoLoader.loadSync(protoTokens, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const packageDefinitionAuth = protoLoader.loadSync(protoAuth, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})

const SlaveServer = grpc.loadPackageDefinition(packageDefinitionSlaveServer).SlaveServer.Users
const MasterServer = grpc.loadPackageDefinition(packageDefinitionMasterServer).MasterServer.Users
const { Tokens } = grpc.loadPackageDefinition(packageDefinitionTokens)
const { Authorization } = grpc.loadPackageDefinition(packageDefinitionAuth).Authorization

const SlaveServerClient = new SlaveServer(
   `${process.env.SLAVE_SERVER ?? 'slave-server:8080'}`,
   grpc.credentials.createInsecure(),
)
const MasterServerClient = new MasterServer(
   `${process.env.MASTER_SERVER ?? 'master-server:8080'}`,
   grpc.credentials.createInsecure(),
)

const GenTokensClient = new Tokens.GenerateTokens(
   `${process.env.TOKENS_MICROSERVICE ?? 'tokens-microservice:8080'}`,
   grpc.credentials.createInsecure(),
)
const ValAccTokensClient = new Tokens.ValidAccessToken(
   `${process.env.TOKENS_MICROSERVICE ?? 'tokens-microservice:8080'}`,
   grpc.credentials.createInsecure(),
)
const ValRefTokensClient = new Tokens.ValidRefreshToken(
   `${process.env.TOKENS_MICROSERVICE ?? 'tokens-microservice:8080'}`,
   grpc.credentials.createInsecure(),
)

async function main(): Promise<number> {
   try {
      const server = new grpc.Server()
      server.addService(Authorization.service, {
         registration: userController.registration,
         login: userController.login,
         logout: userController.logout,
         refresh: userController.refresh,
         forgotPassword: userController.forgotPassword,
      })
      await server.bindAsync(
         `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         grpc.ServerCredentials.createInsecure(),
         () => {
            console.log(`authentication-microservice`)
         },
      )
      return 0
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()

export { SlaveServerClient, MasterServerClient, GenTokensClient, ValAccTokensClient, ValRefTokensClient }
