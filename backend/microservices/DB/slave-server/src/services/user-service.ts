import { ApiError } from 'shared-for-store'
import { Users } from 'types-for-store/src/slave-server'
import { MySequelize } from 'db-for-store/dist/tables'

export interface IUserService {
   userCredentials(props: Users.UserCredGetData): Promise<Users.UserCredentials>
}

class UserService implements IUserService {
   private readonly sequelize: MySequelize
   private readonly Tables: MySequelize['models']
   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }
   userCredentials = async (props: Users.UserCredGetData): Promise<Users.UserCredentials> => {
      try {
         const searchKey = props?. user_id? { user_id: props.user_id }:{ email: props.email } 

         const user = await this.Tables.Users.findOne({
            where: { ...searchKey },
            attributes: ['user_id', 'email', 'login', 'password'],
         })
         if (!user) throw ApiError.BadRequest("User does not exist");

         const token = await this.Tables.Tokens.findOne({
            where: { user_id: user.dataValues.user_id },
            attributes: ['refresh_token'],
         })

         if (!token) return {
            ...user.dataValues,
            refreshToken: "",
         }

         return {
            ...user.dataValues,
            refreshToken: token.dataValues.refresh_token,
         }
      } catch (error) {
         if(error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }

}

export default UserService
