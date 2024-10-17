import { ApiError } from 'shared-for-store'
import { TokensProto } from 'proto-for-store'
import {
   ValidationRequest,
   ValidationResponse,
   GenerationRequest,
   GenerationResponse,
} from 'types-for-store/src/tokens-microservice'
import { Server } from '@grpc/grpc-js'

import tokensController from './controllers/tokens-controller'

async function server(): Promise<Server> {
   try {
      const TestServer = await TokensProto.createTokensServer({
         ServiceHandlers: {
            Tokens: {
               generateTokens: tokensController.generateTokens,
               accessTokenValidation: tokensController.accessTokenValidation,
               refreshTokenValidation: tokensController.refreshTokenValidation,
            },
         },
         url: '0.0.0.0:5000',
      })

      return TestServer
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}

test('tokens-microservice', async () => {
   const TestServer = await server()

   const { TokensGenerateTokens, TokensAccessTokenValidation, TokensRefreshTokenValidation } =
      await TokensProto.createTokensClient({ url: '0.0.0.0:5000' })

   const tokens = await TokensGenerateTokens<GenerationRequest, GenerationResponse>({})

   if (tokens) {
      expect(Object.keys(tokens)).toHaveLength(2)
      expect(tokens).toHaveProperty('accessToken')
      expect(tokens).toHaveProperty('refreshToken')
   } else {
      throw ApiError.BadRequest('No tokens for testing')
   }

   const accessTokenValidationRes = await TokensAccessTokenValidation<ValidationRequest, ValidationResponse>({
      value: tokens.accessToken,
   })
   expect(accessTokenValidationRes).toStrictEqual<ValidationResponse>({ value: true })

   const refreshTokenValidationRes = await TokensRefreshTokenValidation<ValidationRequest, ValidationResponse>({
      value: tokens.refreshToken,
   })
   expect(refreshTokenValidationRes).toStrictEqual<ValidationResponse>({ value: true })

   TestServer.forceShutdown()
})
