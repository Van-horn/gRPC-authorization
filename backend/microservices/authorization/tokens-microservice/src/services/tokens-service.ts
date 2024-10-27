import { sign, verify } from 'jsonwebtoken'
import { TokensService } from 'types-for-store'
import { ApiError } from 'shared-for-store'

class TokensService implements TokensService.Service {
   generateTokens(
      ...[payload]: Parameters<TokensService.Service['generateTokens']>
   ): ReturnType<TokensService.Service['generateTokens']> {
      try {
         const accessToken = sign(payload, process.env.JWT_ACCESS ?? 'JWT_ACCESS', {
            expiresIn: '10m',
         })
         const refreshToken = sign(payload, process.env.JWT_REFRESH ?? 'JWT_REFRESH', {
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
   accessTokenValidation(
      ...[accessToken]: Parameters<TokensService.Service['accessTokenValidation']>
   ): ReturnType<TokensService.Service['accessTokenValidation']> {
      try {
         const payload = verify(accessToken, process.env.JWT_ACCESS ?? 'JWT_ACCESS') as ReturnType<
            TokensService.Service['accessTokenValidation']
         >
         return payload
      } catch (error) {
         throw ApiError.BadRequest('Token died or invalid')
      }
   }
   refreshTokenValidation(
      ...[refreshToken]: Parameters<TokensService.Service['refreshTokenValidation']>
   ): ReturnType<TokensService.Service['refreshTokenValidation']> {
      try {
         const payload = verify(refreshToken, process.env.JWT_REFRESH ?? 'JWT_REFRESH') as ReturnType<
            TokensService.Service['refreshTokenValidation']
         >
         return payload
      } catch (error) {
         throw ApiError.BadRequest('Token died or invalid')
      }
   }
}

export default new TokensService()
