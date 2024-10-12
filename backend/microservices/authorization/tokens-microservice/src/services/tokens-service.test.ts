import tokensService from './tokens-service'

const { generateTokens, accessTokenValidation, refreshTokenValidation } = tokensService

describe('tokens-service', () => {
   const tokens = generateTokens({})
   const { accessToken, refreshToken } = tokens

   test('generateTokens', () => {
      expect(Object.keys(tokens)).toHaveLength(2)
      expect(tokens).toHaveProperty('accessToken')
      expect(tokens).toHaveProperty('refreshToken')
   })
   it('accessTokenValidation', () => {
      expect(accessTokenValidation(accessToken)).toBe<boolean>(true)
      expect(accessTokenValidation('token')).toBe<boolean>(false)
   })
   it('refreshTokenValidation', () => {
      expect(refreshTokenValidation(refreshToken)).toBe<boolean>(true)
      expect(refreshTokenValidation('token')).toBe<boolean>(false)
   })
})
