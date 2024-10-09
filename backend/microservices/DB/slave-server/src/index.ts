import { resolve } from 'path'
import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })
import { ApiError } from 'shared-for-store'
import { SlaveDBProto } from 'proto-for-store'

import GetSequelize from './DB_DATA'
import UserController from './controllers/user-controller'

const sequelize = GetSequelize('production')

const { userCredentials } = new UserController(sequelize)

async function main(): Promise<void> {
   try {
      await SlaveDBProto.createSlaveDBServer({
         url: `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         ServiceHandlers: {
            Users: {
               userCredentials: userCredentials,
            },
         },
         finalCallback: () => {
            console.log('slave-server')
         },
      })

      await sequelize.authenticate()
      await sequelize.sync({ logging: false })
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
