import { ApiError } from 'shared-for-store'
import { TokensProto } from 'proto-for-store'
import { ITokens } from 'types-for-store/src/tokens-microservice'
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

let TestServer: Server | null = null

describe('tokens-microservice', async () => {
   beforeAll(async () => {
      try {
         TestServer = await server()
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   })
   try {
      await server()
      const Clients = await TokensProto.createTokensClient({ url: '0.0.0.0:5000' })
      const tokens = await Clients.TokensGenerateTokens<string, ITokens>('')
      if (tokens) {
         test('generateTokens', () => {
            expect(Object.keys(tokens)).toHaveLength(2)
            expect(tokens).toHaveProperty('accessToken')
            expect(tokens).toHaveProperty('refreshToken')
         })
      } else {
         throw ApiError.BadRequest('No tokens for testing')
      }
   } catch (error) {
      throw ApiError.ServerError([error])
   }

   //    it('accessTokenValidation', () => {
   //       expect(accessTokenValidation(accessToken)).toBe(true)
   //       expect(() => accessTokenValidation('token')).toThrow(ApiError.BadRequest('Token has died'))
   //    })
   //    it('refreshTokenValidation', () => {
   //       expect(refreshTokenValidation(refreshToken)).toBe(true)
   //       expect(() => refreshTokenValidation('token')).toThrow(ApiError.BadRequest('Token has died'))
   //    })
   afterEach(() => {})
})
