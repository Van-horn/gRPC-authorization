const { generateTokens, validAccessToken, validRefreshToken } = require('./tokens-service')
describe('tokens-service', () => {
   const { accessToken, refreshToken } = generateTokens({})
   test('generate-tokens', () => {
      expect(Object.keys(generateTokens({}))).toHaveLength(2)
      expect(generateTokens({})).toHaveProperty('accessToken')
      expect(generateTokens({})).toHaveProperty('refreshToken')
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
