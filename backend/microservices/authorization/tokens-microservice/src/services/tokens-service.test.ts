import { TokensService } from 'types-for-store'
import { ApiError } from 'shared-for-store'

import tokensService from './tokens-service'

const { generateTokens, accessTokenValidation, refreshTokenValidation } = tokensService

describe('tokens-service', () => {
   const tokens = generateTokens({ userId: 1 })
   const { accessToken, refreshToken } = tokens

   test('generateTokens', () => {
      expect(tokens).toEqual(
         expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
         })
      )
   })
   it('accessTokenValidation', () => {
      expect(accessTokenValidation(accessToken)).toEqual<ReturnType<TokensService.Service['accessTokenValidation']>>(
         expect.objectContaining({
            userId: 1,
         })
      )
      expect(() => accessTokenValidation('token')).toThrow(ApiError.BadRequest('Token died or invalid'))
   })

   it('refreshTokenValidation', () => {
      expect(refreshTokenValidation(refreshToken)).toEqual<ReturnType<TokensService.Service['refreshTokenValidation']>>(
         expect.objectContaining({
            userId: 1,
         })
      )

      expect(() => refreshTokenValidation('token')).toThrow(ApiError.BadRequest('Token died or invalid'))
   })
})
