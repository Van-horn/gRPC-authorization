import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { Tokens } from 'types-for-store/tokens'
const { ApiError, grpcErrorHandler } = require('shared-for-store')

import ITokensService from '../services/tokens-service'
const tokensService = require('../services/tokens-service') as ITokensService.TokensService

namespace ITokensController {
   export interface TokensController {
      generateTokens<T>(
         call: ServerUnaryCall<T, Tokens.ITokens | null>,
         callback: sendUnaryData<Tokens.ITokens | null>,
      ): number
      validAccessToken(
         call: ServerUnaryCall<Tokens.IValidationRequest, Tokens.IValidationResponse | null>,
         callback: sendUnaryData<Tokens.IValidationResponse | null>,
      ): number
      validRefreshToken(
         call: ServerUnaryCall<Tokens.IValidationRequest, Tokens.IValidationResponse | null>,
         callback: sendUnaryData<Tokens.IValidationResponse | null>,
      ): number
   }
}

class TokensController implements ITokensController.TokensController {
   generateTokens<T>(
      call: ServerUnaryCall<T, Tokens.ITokens | null>,
      callback: sendUnaryData<Tokens.ITokens | null>,
   ): number {
      try {
         if (!call.request) throw ApiError.BadRequest('No data')

         const result = tokensService.generateTokens<T>(call.request)
         callback(null, result)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   validAccessToken(
      call: ServerUnaryCall<Tokens.IValidationRequest, Tokens.IValidationResponse | null>,
      callback: sendUnaryData<Tokens.IValidationResponse | null>,
   ): number {
      try {
         if (!call.request?.token) throw ApiError.BadRequest('No token')
         const result = tokensService.validAccessToken(call.request.token)
         callback(null, result)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   validRefreshToken(
      call: ServerUnaryCall<Tokens.IValidationRequest, Tokens.IValidationResponse | null>,
      callback: sendUnaryData<Tokens.IValidationResponse | null>,
   ): number {
      try {
         if (!call.request?.token) throw ApiError.BadRequest('No token')
         const result = tokensService.validAccessToken(call.request.token)
         callback(null, result)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
}

export default ITokensController
module.exports = new TokensController()
