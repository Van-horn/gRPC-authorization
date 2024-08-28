/* eslint-disable no-useless-catch */
const { ApiError } = require('shared-for-store')
import { SlaveServer } from 'types-for-store/slave-server'

const { UsersSchema, TokensSchema } = require('../DB_DATA/models')

namespace IUserService {
   export interface IUserService {
      getUser(props: SlaveServer.IGetUserReqData): Promise<SlaveServer.IUser | null>
      // getUserByEmail(props: SlaveServer.IIsUserRes): Promise<SlaveServer.IUser | null>
   }
}

class UserService implements IUserService.IUserService {
   async getUser(props: SlaveServer.IGetUserReqData): Promise<SlaveServer.IUser | null> {
      try {
         const user: Promise<SlaveServer.IUser> = await UsersSchema.findOne({
            where: {
               [props.key]: props[props.key],
            },
            attributes: ['userId', 'login', 'email', 'createdAt', 'password'],
            include: [
               {
                  model: TokensSchema,
                  attributes: ['refreshToken'],
               },
            ],
         })

         if (!user) return null

         return { ...user, ratings: [], favorites: [] }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   // async getUserByEmail({ email }: SlaveServer.IIsUserRes): Promise<SlaveServer.IUser | null> {
   //    try {
   //       const user = await UsersSchema.findOne({
   //          where: { email },
   //          // attributes: ['userId', 'login', 'email', 'createdAt', 'password'],
   //          // include:[{
   //          //     model:TokensSchema
   //          // }],
   //       })

   //       if (!user) throw ApiError.BadRequest('There is not user')

   //       return user
   //    } catch (error: unknown) {
   //       if (error instanceof ApiError) throw error
   //       throw ApiError.ServerError([error])
   //    }
   // }
}

export default IUserService
module.exports = new UserService()
