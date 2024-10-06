import { sign, verify } from 'jsonwebtoken'
import { ITokens, TokenGenerationRequest } from 'types-for-store/src/tokens-microservice'
import { ApiError } from 'shared-for-store'

export interface ITokensService {
   generateTokens(value: TokenGenerationRequest): ITokens
   accessTokenValidation(accessToken: string): boolean
   refreshTokenValidation(refreshToken: string): boolean
}

class TokensService implements ITokensService {
   generateTokens(value: TokenGenerationRequest): ITokens {
      try {
         const accessToken = sign(value, process.env.JWT_ACCESS ?? 'JWT_ACCESS', {
            expiresIn: '10m',
         })
         const refreshToken = sign(value, process.env.JWT_REFRESH ?? 'JWT_REFRESH', {
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
   accessTokenValidation(accessToken: string): boolean {
      try {
         const data = verify(accessToken, process.env.JWT_ACCESS ?? 'JWT_ACCESS')
         return !!data
      } catch (error) {
         return false
      }
   }
   refreshTokenValidation(refreshToken: string): boolean {
      try {
         const data = verify(refreshToken, process.env.JWT_REFRESH ?? 'JWT_REFRESH')
         return !!data
      } catch (error) {
         return false
      }
   }
}

export default new TokensService()
