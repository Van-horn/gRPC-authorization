import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import {
   ValidationResponse,
   ValidationRequest,
   GenerationRequest,
   GenerationResponse
} from 'types-for-store/src/tokens-microservice'
import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { handleUnaryCall } from '@grpc/grpc-js/build/src/server-call'

import tokensService from '../services/tokens-service'
// import { elasticsearchClient } from '..'

export interface ITokensController {
   generateTokens: handleUnaryCall<GenerationRequest, GenerationResponse>
   accessTokenValidation: handleUnaryCall<ValidationRequest, ValidationResponse>
   refreshTokenValidation: handleUnaryCall<ValidationRequest, ValidationResponse>
}

class TokensController implements ITokensController {
 async  generateTokens(call: ServerUnaryCall<GenerationRequest, GenerationResponse>, callback: sendUnaryData<GenerationResponse>): Promise<void> {
      try {
         const result = tokensService.generateTokens(call.request)

         callback(null, result)

      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error));
       
      }
   }
async   accessTokenValidation(
      call: ServerUnaryCall<ValidationRequest, ValidationResponse>,
      callback: sendUnaryData<ValidationResponse>
   ): Promise<void> {
      try {
         if (!call.request.value) throw ApiError.BadRequest('There is not token')

         const result = tokensService.accessTokenValidation(call.request.value)

         callback(null, { value: result })

       
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error));
       
      }
   }
 async  refreshTokenValidation(
      call: ServerUnaryCall<ValidationRequest, ValidationResponse>,
      callback: sendUnaryData<ValidationResponse>
   ): Promise<void> {
      try {
         if (!call.request.value) throw ApiError.BadRequest('There is not token')

         const result = tokensService.refreshTokenValidation(call.request.value)

         callback(null, { value: result })

        
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error));
        
      }
   }
}

export default new TokensController()
