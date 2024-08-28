const { ApiError, grpcErrorHandler } = require('shared-for-store')
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { MasterServer } from 'types-for-store/master-server'

import IUserService from '../services/user-service'
const userService = require('../services/user-service') as IUserService.UserService

namespace IUserController {
   export interface UserController {
      registration(
         call: ServerUnaryCall<MasterServer.IRegReqData, MasterServer.IUser | null>,
         callback: sendUnaryData<MasterServer.IUser | null>,
      ): Promise<number>
      login(
         call: ServerUnaryCall<MasterServer.ILogReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
      logout(
         call: ServerUnaryCall<MasterServer.ILogoutReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
      refresh(
         call: ServerUnaryCall<MasterServer.IRefReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
      forgotPassword(
         call: ServerUnaryCall<MasterServer.IForReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
      writeToken(
         call: ServerUnaryCall<MasterServer.IWTokenReqData, boolean | null>,
         callback: sendUnaryData<boolean | null>,
      ): Promise<number>
   }
}

class UserController implements IUserController.UserController {
   async registration(
      call: ServerUnaryCall<MasterServer.IRegReqData, MasterServer.IUser | null>,
      callback: sendUnaryData<MasterServer.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request?.email || !call.request?.login || !call.request?.password)
            throw ApiError.BadRequest('There are not all data')

         const user = await userService.registration(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async writeToken(
      call: ServerUnaryCall<MasterServer.IWTokenReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isWritten = await userService.writeToken(call.request)
         callback(null, isWritten)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async login(
      call: ServerUnaryCall<MasterServer.ILogReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const user = await userService.login(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async logout(
      call: ServerUnaryCall<MasterServer.ILogoutReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.userId) throw ApiError.BadRequest('There are not all data')

         const user = await userService.logout(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   async refresh(
      call: ServerUnaryCall<MasterServer.IRefReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const user = await userService.refresh(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }

   async forgotPassword(
      call: ServerUnaryCall<MasterServer.IForReqData, boolean | null>,
      callback: sendUnaryData<boolean | null>,
   ): Promise<number> {
      try {
         if (!call.request?.userId || !call.request?.password || !call.request?.refreshToken)
            throw ApiError.BadRequest('There are not all data')

         const user = await userService.forgotPassword(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
}

export default IUserController
module.exports = new UserController()
