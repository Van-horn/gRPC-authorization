import { ApiError } from 'shared-for-store'
import { SlaveDBProto } from 'proto-for-store'
import { Server } from '@grpc/grpc-js'
import { Users } from 'types-for-store/dist/slave-server'

import UserController from './controllers/user-controller'
import GetSequelize from './DB_DATA'

const sequelize = GetSequelize('test')

async function server(): Promise<Server> {
   try {
      const TestServer = await SlaveDBProto.createSlaveDBServer({
         url: `0.0.0.0:5000`,
         ServiceHandlers: {
            Users: {
               userCredentials: new UserController(sequelize).userCredentials,
            },
         },
      })

      await sequelize.authenticate()
      await sequelize.sync({ logging: false })

      return TestServer
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}

test('slave-server', async () => {
   const TestServer = await server()

   const { UsersUserCredentials } = await SlaveDBProto.createSlaveDBClient({ url: '0.0.0.0:5000' })

   const user = await UsersUserCredentials<Users.UserCredGetData, Users.UserCredentials>({ user_id: 1 })
   console.log(user)
   //    if (tokens) {
   //       expect(Object.keys(tokens)).toHaveLength(2)
   //       expect(tokens).toHaveProperty('accessToken')
   //       expect(tokens).toHaveProperty('refreshToken')
   //    } else {
   //       throw ApiError.BadRequest('No tokens for testing')
   //    }

   //    const accessTokenValidationRes = await TokensAccessTokenValidation<ValidationRequest, ValidationResponse>({
   //       value: tokens.accessToken,
   //    })
   //    expect(accessTokenValidationRes).toStrictEqual<ValidationResponse>({ value: true })

   //    const refreshTokenValidationRes = await TokensRefreshTokenValidation<ValidationRequest, ValidationResponse>({
   //       value: tokens.refreshToken,
   //    })
   //    expect(refreshTokenValidationRes).toStrictEqual<ValidationResponse>({ value: true })
   sequelize.close()
   TestServer.forceShutdown()
}, 60000)
