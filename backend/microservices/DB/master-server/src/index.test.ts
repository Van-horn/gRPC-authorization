import { ApiError } from 'shared-for-store'
import { SlaveDBProto } from 'proto-for-store'
import { Server } from '@grpc/grpc-js'
import { Users } from 'types-for-store/dist/slave-server'
import equivalence from 'types-for-store'

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

   const user = await UsersUserCredentials<Users.UserCredGetData, Users.UserCredentials>({ user_id: 1 })
   expect(user).toEqual<Users.UserCredentials>(equivalence.emptySlaveServerUserCred)

   sequelize.close()
   TestServer.forceShutdown()
}, 20000)
