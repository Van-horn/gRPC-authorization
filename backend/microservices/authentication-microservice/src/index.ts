import { resolve } from 'path'
import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })
import { ApiError } from 'shared-for-store'
import { AuthorizationProto, TokensProto, SlaveDBProto, MasterDBProto } from 'proto-for-store'

import userController from './controllers/user-controller'

async function main(): Promise<void> {
   try {
      const TokensClient = await TokensProto.createTokensClient({ url: 'tokens-microservice' })
      const SlaveDBProtoClient = await SlaveDBProto.createSlaveDBClient({ url: 'slave-server' })
      const MasterDBProtoClient = await MasterDBProto.createMasterDBClient({ url: 'master-server' })

      const { registration, login, logout, refresh, forgotPassword } = new userController({
         TokensClient,
         SlaveDBProtoClient,
         MasterDBProtoClient,
      })
      await AuthorizationProto.createAuthorizationServer({
         url: '0.0.0.0:8080',
         ServiceHandlers: {
            Authorization: {
               registration,
               login,
               logout,
               refresh,
               forgotPassword,
            },
         },
         finalCallback: () => {
            console.log(`authentication-microservice`)
         },
      })
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
