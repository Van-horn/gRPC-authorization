import { ApiError } from 'shared-for-store'
import { Users } from 'types-for-store/src/slave-server'
import { Tables } from '..'

export interface IUserService {
   userCredentials(props: Users.GetUserCredentials): Promise<Users.UserCredentials | null>
}

class UserService implements IUserService {
   async userCredentials(props: Users.GetUserCredentials): Promise<Users.UserCredentials | null> {
      try {
         const user = await Tables.Users.findOne()

         // .findOne({
         //    where: {
         //       [props.key]: props[props.key],
         //    },
         //    attributes: ['user_id', 'login', 'email', 'createdAt', 'password'],
         //    include: [
         //       {
         //          model: Tables.Tokens,
         //          attributes: ['refreshToken'],
         //       },
         //    ],
         // })
         if (!user) return null

         return user
      } catch (error) {
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

export default new UserService()
