import { resolve } from 'path'
import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })
import { ApiError } from 'shared-for-store'
import { TokensProto } from 'proto-for-store'

import tokensController from './controllers/tokens-controller'

async function main(): Promise<void> {
   try {
      await TokensProto.createTokensServer({
         ServiceHandlers: {
            Tokens: {
               generateTokens: tokensController.generateTokens,
               accessTokenValidation: tokensController.accessTokenValidation,
               refreshTokenValidation: tokensController.refreshTokenValidation,
            },
         },
         url: '0.0.0.0:8080',
         finalCallback: () => {
            console.log('tokens-microservice')
         },
      })
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
