import { resolve } from 'path'
import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })
import { ApiError } from 'shared-for-store'
import { MasterDBProto } from 'proto-for-store'

import GetSequelize from './DB_DATA'
import UserController from './controllers/user-controller'

export const sequelize = GetSequelize('production')

const { refresh, registration, forgotPassword, login, logout } = new UserController(sequelize)

async function main(): Promise<void> {
   try {
      await MasterDBProto.createMasterDBServer({
         url: `${process.env.HOST ?? '0.0.0.0'}:${process.env.PORT ?? 8080}`,
         ServiceHandlers: {
            Authorization: { refresh, login, logout, registration, forgotPassword },
         }
      
      })

      await sequelize.authenticate()
      await sequelize.sync({ logging: false })
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
