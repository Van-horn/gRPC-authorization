const jwt = require('jsonwebtoken')
import { ITokens } from 'types-for-store/tokens'

namespace ITokensService {
   export interface ITokensService {
      generateTokens(payload: unknown): ITokens.ITokens
      validAccessToken(accessToken: string): boolean
      validRefreshToken(refreshToken: string): boolean
   }
}

class TokensService implements ITokensService.ITokensService {
   generateTokens(payload: unknown): ITokens.ITokens {
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
   }
   validAccessToken(accessToken: string): boolean {
      try {
         const data = jwt.verify(accessToken, process.env.JWT_ACCESS ?? 'JWT_ACCESS')
         return !!data
      } catch (error) {
         return false
      }
   }
   validRefreshToken(refreshToken: string): boolean {
      try {
         const data = jwt.verify(refreshToken, process.env.JWT_REFRESH ?? 'JWT_REFRESH')
         return !!data
      } catch (error) {
         return false
      }
   }
}

module.exports = new TokensService()
