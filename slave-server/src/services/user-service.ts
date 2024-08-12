/* eslint-disable no-useless-catch */
import { SlaveServer } from 'types-for-store/slave-server'

const { UsersSchema, TokensSchema } = require('../DB_DATA/models')
const ApiError = require('../exceptions/ApiError')

namespace IUserService {
   export interface IUserService {
      getUser({ userId }: SlaveServer.IGetUserReqData): Promise<SlaveServer.IUser | null>
   }
}

class UserService implements IUserService.IUserService {
   async getUser({ userId }: SlaveServer.IGetUserReqData): Promise<SlaveServer.IUser | null> {
      try {
         if (!userId) throw ApiError.BadRequest('There are not all data')

         const user: Promise<SlaveServer.IUser> = await UsersSchema.findByPk(userId, {
            // attributes: ['userId', 'login', 'email', 'createdAt', 'password'],
            // include:[{
            //     model:TokensSchema
            // }],
         })

         if (!user) throw ApiError.BadRequest('There is not user')

         return user
      } catch (error) {
         throw error
      }
   }
}

module.exports = new UserService()
