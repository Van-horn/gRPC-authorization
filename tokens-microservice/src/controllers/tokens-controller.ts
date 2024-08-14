import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { ITokens } from 'types-for-store/tokens'
const { ApiError } = require('shared-for-store')

const tokensService = require('../services/tokens-service')

namespace ITokensController {
   export interface ITokensController {
      generateTokens(
         call: ServerUnaryCall<unknown, ITokens.ITokens | null>,
         callback: sendUnaryData<ITokens.ITokens | null>,
      ): number
      validAccessToken(
         call: ServerUnaryCall<ITokens.IValidationRequest, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): number
      validRefreshToken(
         call: ServerUnaryCall<ITokens.IValidationRequest, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): number
   }
}

class TokensController implements ITokensController.ITokensController {
   generateTokens(
      call: ServerUnaryCall<unknown, ITokens.ITokens | null>,
      callback: sendUnaryData<ITokens.ITokens | null>,
   ): number {
      try {
         if (!call.request) throw ApiError.BadRequest('No data')
         const result: ITokens.ITokens = tokensService.generateTokens(call.request)
         callback(null, result)
         return 0
      } catch (error: any) {
         callback(error, null)
         return 1
      }
   }
   validAccessToken(
      call: ServerUnaryCall<ITokens.IValidationRequest, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): number {
      try {
         if (!call.request.token) throw ApiError.BadRequest('No token')
         const result: boolean = tokensService.validAccessToken(call.request.token)
         callback(null, result)
         return 0
      } catch (error: any) {
         callback(error, null)
         return 1
      }
   }
   validRefreshToken(
      call: ServerUnaryCall<ITokens.IValidationRequest, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): number {
      try {
         if (!call.request.token) throw ApiError.BadRequest('No token')
         const result: boolean = tokensService.validAccessToken(call.request.token)
         callback(null, result)
         return 0
      } catch (error: any) {
         callback(error, null)
         return 1
      }
   }
}

module.exports = new TokensController()
