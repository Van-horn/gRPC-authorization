import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { SlaveServerUserController } from 'types-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

import UserService from '../services/user-service'

class UserController implements SlaveServerUserController.Controller {
   private readonly service: UserService

   constructor(sequelize: MySequelize) {
      this.service = new UserService(sequelize)
   }

   userCredentials = async (
      ...[call, callback]: Parameters<SlaveServerUserController.Controller['userCredentials']>
   ): Promise<ReturnType<SlaveServerUserController.Controller['userCredentials']>> => {
      try {
         if (!call.request) throw ApiError.BadRequest('There are not data')

         const user = await this.service.userCredentials(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
}

export default UserController
