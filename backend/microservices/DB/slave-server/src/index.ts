import { resolve } from 'path'
import sequelize from './DB_DATA'
import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })
import { ApiError } from 'shared-for-store'
import { SlaveDBProto } from 'proto-for-store'
import { GetSchemes } from 'db-for-store'

import userController from './controllers/user-controller'

export const Tables = GetSchemes(sequelize)

async function main(): Promise<void> {
   try {
      await SlaveDBProto.createSlaveDBServer({
         url: `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         ServiceHandlers: {
            Users: {
               userCredentials: userController.userCredentials,
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
