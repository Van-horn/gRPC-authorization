import { ApiError } from 'shared-for-store'
import { SlaveServerUserService } from 'types-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

class UserService implements SlaveServerUserService.Service {
   private readonly sequelize: MySequelize
   private readonly Tables: MySequelize['models']
   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }
   userCredentials = async (
      ...[props]: Parameters<SlaveServerUserService.Service['userCredentials']>
   ): ReturnType<SlaveServerUserService.Service['userCredentials']> => {
      try {
         const searchKey = 'userId' in props ? { user_id: props.userId } : { email: props.email }

         const user = await this.Tables.Users.findOne({
            where: { ...searchKey },
            attributes: ['user_id', 'email', 'login', 'password'],
         })
         if (!user) throw ApiError.BadRequest('User does not exist')

         const {
            dataValues: { user_id, ...userData },
         } = user

         const token = await this.Tables.Tokens.findOne({
            where: { user_id: user.dataValues.user_id },
            attributes: ['refresh_token'],
         })

         if (!token)
            return {
               ...userData,
               userId: user_id,
               refreshToken: '',
            }

         return {
            ...userData,
            userId: user_id,
            refreshToken: token.dataValues.refresh_token,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
