const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const sequelize = require('./DB_DATA')
require('dotenv').config({ path: path.join(__dirname, './.env') })
const { ApiError } = require('shared-for-store')
const protoFile = path.join(__dirname, '../node_modules', 'proto-for-store', 'src', 'master-server', '.proto')

import IUserController from './controllers/user-controller'
const tokensController = require('./controllers/user-controller') as IUserController.UserController

const packageDefinition = protoLoader.loadSync(protoFile, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true,
})
const { Users } = grpc.loadPackageDefinition(packageDefinition).MasterServer

async function main(): Promise<number> {
   try {
      await sequelize.authenticate()
      await sequelize.sync({ alter: false, logging: false, force: false })
      const server = new grpc.Server()
      server.addService(Users.service, {
         registration: tokensController.registration,
         writeToken: tokensController.writeToken,
         login: tokensController.login,
         logout: tokensController.logout,
         refresh: tokensController.refresh,
         forgotPassword: tokensController.forgotPassword,
      })
      await server.bindAsync(
         `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         grpc.ServerCredentials.createInsecure(),
         () => {
            console.log('master-server')
         },
      )
      return 0
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
