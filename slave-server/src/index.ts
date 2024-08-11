const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const sequelize = require('./DB_DATA')
require('dotenv').config({ path: path.join(__dirname, './.env') })
const protoFile = path.join(__dirname, '../node_modules', 'proto-for-store', 'slave-server', '.proto')

const tokensController = require('./controllers/user-controller')

const packageDefinition = protoLoader.loadSync(protoFile, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const {
   SlaveServer: { Users },
} = grpc.loadPackageDefinition(packageDefinition)

async function main(): Promise<number> {
   try {
      await sequelize.authenticate()
      await sequelize.sync()
      const server = new grpc.Server()
      server.addService(Users.service, { getUser: tokensController.getUser })
      await server.bindAsync(
         `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         grpc.ServerCredentials.createInsecure(),
         () => {
            console.log('slave-server')
         },
      )
      return 0
   } catch (error) {
      console.error('Error starting server:', error)
      return 1
   }
}
main()
