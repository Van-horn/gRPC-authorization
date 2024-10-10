import { MySequelize } from 'db-for-store/dist/tables'
import { ApiError } from 'shared-for-store'
import { Authorization } from 'types-for-store/dist/master-server'

export interface IUserService {
   registration(props: Authorization.RegistrationData): Promise<Authorization.ICredentials>
   login(props: Authorization.LoginData): Promise<boolean>
   logout(props: Authorization.LogoutData): Promise<boolean>
   refresh(props: Authorization.RefreshData): Promise<boolean>
   forgotPassword(props: Authorization.ForgotPasswordData): Promise<boolean>
   writeToken(props: Authorization.WriteTokenData): Promise<boolean>
}

class UserService implements IUserService {
   private readonly sequelize: MySequelize
   private readonly Tables: MySequelize['models']
   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }

   registration = async (props: Authorization.RegistrationData): Promise<Authorization.ICredentials> => {
      try {
         const user = await this.Tables.Users.create(props)
         return {}
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   writeToken = async (props: Authorization.WriteTokenData): Promise<boolean> => {
      try {
         await TokensSchema.create(props)
         return true
      } catch (error) {
         return false
      }
   }
   login = async ({ userId, refreshToken }: Authorization.LoginData): Promise<boolean> => {
      try {
         await TokensSchema.upsert({ refreshToken }, { where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   logout = async ({ userId }: Authorization.LogoutData): Promise<boolean> => {
      try {
         await TokensSchema.destroy({ where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   refresh = async ({ userId, refreshToken }: Authorization.RefreshData): Promise<boolean> => {
      try {
         await TokensSchema.update({ refreshToken }, { where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async ({ userId, password, refreshToken }: Authorization.ForgotPasswordData): Promise<boolean> => {
      try {
         await UsersSchema.update({ password }, { where: { userId } })
         await TokensSchema.update({ refreshToken }, { where: { userId } })

         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
