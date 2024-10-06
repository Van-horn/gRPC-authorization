import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { ServerUnaryCall, handleUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { Users } from 'types-for-store/src/slave-server'

import userService from '../services/user-service'

export interface IUserController {
   userCredentials: handleUnaryCall<Users.UserCredGetData, Users.UserCredentials | null>
}

class UserController implements IUserController {
   async userCredentials(
      call: ServerUnaryCall<Users.UserCredGetData, Users.UserCredentials | null>,
      callback: sendUnaryData<Users.UserCredentials | null>,
   ) {
      try {
         if (!(call.request?.user_id ?? call.request?.email)) throw ApiError.BadRequest('There are not data')

         const user = await userService.userCredentials(call.request)
         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) {
            callback(grpcErrorHandler(error), null)
         } else {
            callback(null, null)
         }
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

export default new UserController()
