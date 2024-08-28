const jwt = require('jsonwebtoken')
import { Tokens } from 'types-for-store/tokens'
const { ApiError } = require('shared-for-store')

namespace ITokensService {
   export interface TokensService {
      generateTokens<T>(payload: T): Tokens.ITokens
      validAccessToken(accessToken: string): Tokens.IValidationResponse
      validRefreshToken(refreshToken: string): Tokens.IValidationResponse
   }
}

class TokensService implements ITokensService.TokensService {
   generateTokens<T>(payload: T): Tokens.ITokens {
      try {
         const accessToken = jwt.sign(payload, process.env.JWT_ACCESS ?? 'JWT_ACCESS', {
            expiresIn: '10m',
         })
         const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH ?? 'JWT_REFRESH', {
            expiresIn: '30d',
         })
         return {
            accessToken,
            refreshToken,
         }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   validAccessToken<T, Response>(accessToken: T): Response {
      try {
         const data = jwt.verify(accessToken, process.env.JWT_ACCESS ?? 'JWT_ACCESS')
         return !!data as Response
      } catch (error) {
         throw ApiError.BadRequest('Token has died')
      }
   }
   validRefreshToken<T, Response>(refreshToken: T): Response {
      try {
         const data = jwt.verify(refreshToken, process.env.JWT_REFRESH ?? 'JWT_REFRESH')
         return !!data as Response
      } catch (error) {
         throw ApiError.BadRequest('Token has died')
      }
   }
}

export default ITokensService
module.exports = new TokensService()
