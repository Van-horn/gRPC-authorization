import { ApiError } from 'shared-for-store'
import { TokensProto } from 'proto-for-store'
import { TokensController } from 'types-for-store'
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

   const tokens = await TokensGenerateTokens<
      TokensController.GenerateTokensRequest,
      TokensController.GenerateTokensResponse
   >({ userId: 1 })

   if (tokens) {
      expect(tokens).toEqual(
         expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
         })
      )
   } else {
      throw ApiError.BadRequest('No tokens for testing')
   }

   const accessTokenValidationRes = await TokensAccessTokenValidation<
      TokensController.ValidationRequest,
      TokensController.ValidationResponse
   >({
      value: tokens.accessToken,
   })

   if (accessTokenValidationRes) {
      expect(accessTokenValidationRes).toEqual<TokensController.ValidationResponse>(
         expect.objectContaining({
            userId: 1,
         })
      )
   } else {
      throw ApiError.BadRequest('No validation result')
   }

   const refreshTokenValidationRes = await TokensRefreshTokenValidation<
      TokensController.ValidationRequest,
      TokensController.ValidationResponse
   >({
      value: tokens.refreshToken,
   })

   if (refreshTokenValidationRes) {
      expect(refreshTokenValidationRes).toEqual<TokensController.ValidationResponse>(
         expect.objectContaining({
            userId: 1,
         })
      )
   } else {
      throw ApiError.BadRequest('No validation result')
   }

   TestServer.forceShutdown()
})
