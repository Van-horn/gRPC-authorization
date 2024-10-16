import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { ServerUnaryCall, handleUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { Users } from 'types-for-store/src/slave-server'
import { MySequelize } from 'db-for-store/dist/tables'

import UserService from '../services/user-service'

export interface IUserController {
   userCredentials: handleUnaryCall<Users.UserCredGetData, Users.UserCredentials>
}

class UserController implements IUserController {
   private readonly service: UserService

   constructor(sequelize: MySequelize) {
      this.service = new UserService(sequelize)
   }

   userCredentials = async (
      call: ServerUnaryCall<Users.UserCredGetData, Users.UserCredentials>,
      callback: sendUnaryData<Users.UserCredentials>,
   ): Promise<void> => {
      try {
         if (!(call.request?.user_id ?? call.request?.email)) throw ApiError.BadRequest('There are not data')

            const user = await this.service.userCredentials(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }

}

export default UserController
