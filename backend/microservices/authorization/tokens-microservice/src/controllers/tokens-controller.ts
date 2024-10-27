import { TokensController } from 'types-for-store'
import { ApiError, grpcErrorHandler } from 'shared-for-store'

import tokensService from '../services/tokens-service'

class TokensController implements TokensController.Controller {
   async generateTokens(
      ...[call, callback]: Parameters<TokensController.Controller['generateTokens']>
   ): Promise<ReturnType<TokensController.Controller['generateTokens']>> {
      try {
         if (!call.request?.userId) throw ApiError.BadRequest('No data for tokens creating')

         const tokens = tokensService.generateTokens(call.request)

         callback(null, tokens)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
   async accessTokenValidation(
      ...[call, callback]: Parameters<TokensController.Controller['accessTokenValidation']>
   ): Promise<Promise<ReturnType<TokensController.Controller['accessTokenValidation']>>> {
      try {
         if (!call.request?.value) throw ApiError.BadRequest('There is not token')

         const payload = tokensService.accessTokenValidation(call.request.value)

         callback(null, payload)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
   async refreshTokenValidation(
      ...[call, callback]: Parameters<TokensController.Controller['refreshTokenValidation']>
   ): Promise<Promise<ReturnType<TokensController.Controller['refreshTokenValidation']>>> {
      try {
         if (!call.request?.value) throw ApiError.BadRequest('There is not token')

         const payload = tokensService.refreshTokenValidation(call.request.value)

         callback(null, payload)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
}

export default new TokensController()
