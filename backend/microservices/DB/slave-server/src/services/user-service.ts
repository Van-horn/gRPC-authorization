import { ApiError } from 'shared-for-store'
import { Users } from 'types-for-store/dist/slave-server'
import equivalence from 'types-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

export interface IUserService {
   userCredentials(props: Users.UserCredGetData): Promise<Users.UserCredentials>
}

class UserService implements IUserService {
   private sequelize: MySequelize
   private Tables: MySequelize['models']
   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }
   async userCredentials(props: Users.UserCredGetData): Promise<Users.UserCredentials> {
      try {
         const searchKey = props?.email ? { email: props.email } : { user_id: props.user_id }

         const user = await this.Tables.Users.findOne({
            where: { ...searchKey },
            attributes: ['user_id', 'email', 'login', 'password'],
         })

         if (!user) return equivalence.emptySlaveServerUserCred

         const token = await this.Tables.Tokens.findOne({
            where: { user_id: user.dataValues.user_id },
            attributes: ['refresh_token'],
         })

         if (!token) throw ApiError.UnAthorizedError()

         return {
            ...user.dataValues,
            refreshToken: token.dataValues.refresh_token,
         }
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

export default UserService
