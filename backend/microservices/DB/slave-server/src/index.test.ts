import { ApiError } from 'shared-for-store'
import { SlaveDBProto } from 'proto-for-store'
import { Server } from '@grpc/grpc-js'
import { SlaveServerUserController } from 'types-for-store'

import UserController from './controllers/user-controller'
import GetSequelize from './DB_DATA'

const sequelize = GetSequelize('test')

const { userCredentials } = new UserController(sequelize)

async function server(): Promise<Server> {
   try {
      const TestServer = await SlaveDBProto.createSlaveDBServer({
         url: `0.0.0.0:5000`,
         ServiceHandlers: {
            Users: {
               userCredentials: userCredentials,
            },
         },
      })

      return TestServer
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}

test('slave-server', async () => {
   const TestServer = await server()

   await sequelize.authenticate()
   await sequelize.sync({ logging: false })

   const { UsersUserCredentials } = await SlaveDBProto.createSlaveDBClient({ url: '0.0.0.0:5000' })

   const user = await UsersUserCredentials<
      SlaveServerUserController.CredentialsRequest,
      SlaveServerUserController.CredentialsResponse
   >({ userId: 1 })

   expect(user).toBe(undefined)

   sequelize.close()
   TestServer.forceShutdown()
}, 20000)
