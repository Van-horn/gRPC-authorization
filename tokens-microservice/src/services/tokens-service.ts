const jwt = require('jsonwebtoken')
import { ITokens } from 'types-for-store/tokens'
const { ApiError } = require('shared-for-store')

namespace ITokensService {
   export interface ITokensService {
      generateTokens(payload: unknown): ITokens.ITokens | null
      validAccessToken(accessToken: string): boolean
      validRefreshToken(refreshToken: string): boolean
   }
}

class TokensService implements ITokensService.ITokensService {
   generateTokens(payload: unknown): ITokens.ITokens | null {
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
      } catch (error: unknown) {
         throw ApiError.ServerError([error])
      }
   }
   validAccessToken(accessToken: string): boolean {
      try {
         const data = jwt.verify(accessToken, process.env.JWT_ACCESS ?? 'JWT_ACCESS')
         return !!data
      } catch (error) {
         throw ApiError.BadRequest('Token has died')
      }
   }
   validRefreshToken(refreshToken: string): boolean {
      try {
         const data = jwt.verify(refreshToken, process.env.JWT_REFRESH ?? 'JWT_REFRESH')
         return !!data
      } catch (error) {
         throw ApiError.BadRequest('Token has died')
      }
   }
}

module.exports = new TokensService()
