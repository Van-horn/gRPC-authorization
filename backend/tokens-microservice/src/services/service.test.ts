import ITokensService from './tokens-service'

const { generateTokens, validAccessToken, validRefreshToken } =
   require('./tokens-service') as ITokensService.TokensService

describe('tokens-service', () => {
   const tokens = generateTokens<Record<never, never>>({})
   const { accessToken, refreshToken } = tokens

   test('generate-tokens', () => {
      expect(Object.keys(tokens)).toHaveLength(2)
      expect(tokens).toHaveProperty('accessToken')
      expect(tokens).toHaveProperty('refreshToken')
   })
   test('valid-accesstoken', () => {
      expect(validAccessToken(accessToken)).toBe(true)
      expect(validAccessToken(' ')).toBe(false)
   })
   test('valid-refreshToken', () => {
      expect(validRefreshToken(refreshToken)).toBe(true)
      expect(validRefreshToken(' ')).toBe(false)
   })
})
