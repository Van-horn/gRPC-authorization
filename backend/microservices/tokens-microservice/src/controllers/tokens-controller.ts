import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import {
   ITokens,
   ValidationResponse,
   ValidationRequest,
   TokenGenerationRequest,
} from 'types-for-store/src/tokens-microservice'
import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { handleUnaryCall } from '@grpc/grpc-js/build/src/server-call'

import tokensService from '../services/tokens-service'

export interface ITokensController {
   generateTokens: handleUnaryCall<TokenGenerationRequest, ITokens>
   accessTokenValidation: handleUnaryCall<ValidationRequest, ValidationResponse>
   refreshTokenValidation: handleUnaryCall<ValidationRequest, ValidationResponse>
}

class TokensController implements ITokensController {
   generateTokens(call: ServerUnaryCall<TokenGenerationRequest, ITokens>, callback: sendUnaryData<ITokens>): void {
      try {
         const result = tokensService.generateTokens(call.request)
         callback(null, result)
      } catch (error) {
         if (error instanceof ApiError) {
            callback(grpcErrorHandler(error), null)
         } else {
            callback(null, null)
         }
      }
   }
   accessTokenValidation(
      call: ServerUnaryCall<ValidationRequest, ValidationResponse | null>,
      callback: sendUnaryData<ValidationResponse | null>
   ): void {
      try {
         if (!call.request.value) throw ApiError.BadRequest('No token')
         const result = tokensService.accessTokenValidation(call.request.value)
         callback(null, { value: result })
      } catch (error) {
         if (error instanceof ApiError) {
            callback(grpcErrorHandler(error), null)
         } else {
            callback(null, null)
         }
      }
   }
   refreshTokenValidation(
      call: ServerUnaryCall<ValidationRequest, ValidationResponse | null>,
      callback: sendUnaryData<ValidationResponse | null>
   ): void {
      try {
         if (!call.request.value) throw ApiError.BadRequest('No token')
         const result = tokensService.refreshTokenValidation(call.request.value)
         callback(null, { value: result })
      } catch (error) {
         if (error instanceof ApiError) {
            callback(grpcErrorHandler(error), null)
         } else {
            callback(null, null)
         }
      }
   }
}

export default new TokensController()
