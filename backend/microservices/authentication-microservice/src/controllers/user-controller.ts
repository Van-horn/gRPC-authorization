const grpc = require('@grpc/grpc-js')
const { ApiError, grpcErrorHandler } = require('shared-for-store')
import { AuthMicroservice } from 'types-for-store/authentication-microservice'
import { sendUnaryData, ServerUnaryCall, ServiceError } from '@grpc/grpc-js'

import IUserService from '../services/user-service'
import { Tokens } from 'types-for-store/tokens'
const userService = require('../services/user-service') as IUserService.UserService
const { ValAccTokensClient, ValRefTokensClient } = require('../index')

namespace IUserController {
   export interface UserController {
      registration(
         call: ServerUnaryCall<AuthMicroservice.IRegReqData, AuthMicroservice.IUser | null>,
         callback: sendUnaryData<AuthMicroservice.IUser | null>,
      ): Promise<number>
      login(
         call: ServerUnaryCall<AuthMicroservice.ILogReqData, AuthMicroservice.IUser | null>,
         callback: sendUnaryData<AuthMicroservice.IUser | null>,
      ): Promise<number>
      logout(
         call: ServerUnaryCall<AuthMicroservice.ILogoutReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
      refresh(
         call: ServerUnaryCall<AuthMicroservice.IRefReqData, AuthMicroservice.IUser | null>,
         callback: sendUnaryData<AuthMicroservice.IUser | null>,
      ): Promise<number>
      forgotPassword(
         call: ServerUnaryCall<AuthMicroservice.IForReqData, AuthMicroservice.IUser | null>,
         callback: sendUnaryData<AuthMicroservice.IUser | null>,
      ): Promise<number>
   }
}

class UserController implements IUserController.UserController {
   async registration(
      call: ServerUnaryCall<AuthMicroservice.IRegReqData, AuthMicroservice.IUser | null>,
      callback: sendUnaryData<AuthMicroservice.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request?.email || !call.request?.password || !call.request?.login)
            throw ApiError.BadRequest('There are not all data')
         const user = await userService.registration(call.request)

         const metadata = new grpc.Metadata()
         metadata.add('set-cookie', `Set-Cookie: refreshToken=${user.refreshToken}; HttpOnly; Path=/`)
         delete user.refreshToken

         callback(null, user)
         return 0
      } catch (error) {
         console.log(error)
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async login(
      call: ServerUnaryCall<AuthMicroservice.ILogReqData, AuthMicroservice.IUser | null>,
      callback: sendUnaryData<AuthMicroservice.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request?.email || !call.request?.password) throw ApiError.BadRequest('There is not all data')

         const user = await userService.login(call.request)

         const metadata = new grpc.Metadata()
         metadata.add('set-cookie', `Set-Cookie: refreshToken=${user.refreshToken}; HttpOnly; Path=/`)
         delete user.refreshToken

         callback(null, user)
         return 0
      } catch (error) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async logout(
      call: ServerUnaryCall<AuthMicroservice.ILogoutReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.accessToken || !call.request?.userId) throw ApiError.BadRequest('There is not all data')
         const validRes = await new Promise<Tokens.IValidationResponse>((resolve, reject) => {
            ValAccTokensClient.validAccessToken(
               { token: call.request?.accessToken },
               (error: ServiceError, response: Tokens.IValidationResponse) => {
                  if (error) return reject(error)
                  return resolve(response)
               },
            )
         })
         if (!validRes) ApiError.UnAthorizedError()

         const res = await userService.logout(call.request)
         callback(null, res)
         return 0
      } catch (error) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async refresh(
      call: ServerUnaryCall<AuthMicroservice.IRefReqData, AuthMicroservice.IUser | null>,
      callback: sendUnaryData<AuthMicroservice.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request?.refreshToken || !call.request?.userId) throw ApiError.BadRequest('There is not all data')
         const validRes = await new Promise<Tokens.IValidationResponse>((resolve, reject) => {
            ValRefTokensClient.ValidRefreshToken(
               { token: call.request?.refreshToken },
               (error: ServiceError, response: Tokens.IValidationResponse) => {
                  if (error) return reject(error)
                  return resolve(response)
               },
            )
         })
         if (!validRes) ApiError.UnAthorizedError()

         const user = await userService.refresh(call.request)

         const metadata = new grpc.Metadata()
         metadata.add('set-cookie', `Set-Cookie: refreshToken=${user.refreshToken}; HttpOnly; Path=/`)
         delete user.refreshToken

         callback(null, user)
         return 0
      } catch (error) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async forgotPassword(
      call: ServerUnaryCall<AuthMicroservice.IForReqData, AuthMicroservice.IUser | null>,
      callback: sendUnaryData<AuthMicroservice.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request?.email || !call.request?.password) throw ApiError.BadRequest('There is not all data')

         const user = await userService.forgotPassword(call.request)

         const metadata = new grpc.Metadata()
         metadata.add('set-cookie', `Set-Cookie: refreshToken=${user.refreshToken}; HttpOnly; Path=/`)
         delete user.refreshToken

         callback(null, user)
         return 0
      } catch (error) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
}

export default IUserController
module.exports = new UserController()
