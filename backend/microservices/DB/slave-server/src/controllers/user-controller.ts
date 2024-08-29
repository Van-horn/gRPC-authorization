const { ApiError, grpcErrorHandler } = require('shared-for-store')
import { SlaveServer } from 'types-for-store/slave-server'
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'

import IUserService from '../services/user-service'
const userService = require('../services/user-service') as IUserService.IUserService

namespace IUserController {
   export interface UserController {
      getUser(
         call: ServerUnaryCall<SlaveServer.IGetUserReqData, SlaveServer.IUser | null>,
         callback: sendUnaryData<SlaveServer.IUser | null>,
      ): Promise<number>
      // getUserByEmail(
      //    call: ServerUnaryCall<SlaveServer.IGetUserByEmailReqData, SlaveServer.IUser | null>,
      //    callback: sendUnaryData<SlaveServer.IUser | null>,
      // ): Promise<number>
   }
}

class UserController implements IUserController.UserController {
   async getUser(
      call: ServerUnaryCall<SlaveServer.IGetUserReqData, SlaveServer.IUser | null>,
      callback: sendUnaryData<SlaveServer.IUser | null>,
   ): Promise<number> {
      try {
         if (!(call.request?.userId ?? call.request?.email)) throw ApiError.BadRequest('There are not data')

         const user = await userService.getUser(call.request)
         callback(null, user)
         return 0
      } catch (error: typeof ApiError) {
         console.log(error)
         callback(grpcErrorHandler(error), null)
         return 1
      }
   }
   // async getUserByEmail(
   //    call: ServerUnaryCall<SlaveServer.IGetUserByEmailReqData, SlaveServer.IUser | null>,
   //    callback: sendUnaryData<SlaveServer.IUser | null>,
   // ): Promise<number> {
   //    try {
   //       if (!call.request?.email) throw ApiError.BadRequest('There are not all data')

   //       const isUser = await userService.isUser(call.request)
   //       callback(null, isUser)
   //       return 0
   //    } catch (error: typeof ApiError) {
   //       callback(grpcErrorHandler(error), null)
   //       return 1
   //    }
   // }
}

export default IUserController
module.exports = new UserController()
