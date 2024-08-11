import { SlaveServer } from 'types-for-store/slave-server'
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'

const userService = require('../services/user-service')
const ApiError = require('../exceptions/ApiError')

namespace IUserController {
   export interface IUserController {
      getUser(
         call: ServerUnaryCall<SlaveServer.IGetUserReqData, SlaveServer.IUser | null>,
         callback: sendUnaryData<SlaveServer.IUser | null>,
      ): Promise<number>
   }
}

class UserController implements IUserController.IUserController {
   async getUser(
      call: ServerUnaryCall<SlaveServer.IGetUserReqData, SlaveServer.IUser | null>,
      callback: sendUnaryData<SlaveServer.IUser | null>,
   ): Promise<number> {
      try {
         if (!call.request.userId) throw ApiError.BadRequest('There are not all data')

         const user = await userService.getUser(call.request)
         callback(null, user)
         return 0
      } catch (error) {
         callback(null)
         return 1
      }
   }
}

module.exports = new UserController()
