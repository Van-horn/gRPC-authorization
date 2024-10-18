import { MySequelize } from 'db-for-store/dist/tables'
import { ApiError } from 'shared-for-store'
import { Authorization } from 'types-for-store/src/master-server'

interface IUserService {
   registration(props: Authorization.RegistrationData): Promise<Authorization.RegistrationRes>
   login(props: Authorization.LoginData): Promise<boolean>
   logout(props: Authorization.LogoutData): Promise<boolean>
   refresh(props: Authorization.RefreshData): Promise<boolean>
   forgotPassword(props: Authorization.ForgotPasswordData): Promise<boolean>
}

class UserService implements IUserService {
   private readonly sequelize: MySequelize
   private readonly Tables: MySequelize['models']

   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }


   registration = async ({
      refreshToken,
      ...props
   }: Authorization.RegistrationData): Promise<Authorization.RegistrationRes> => {
      try {
         const {
            dataValues: { user_id },
         } = await this.Tables.Users.create(props)

         await this.Tables.Tokens.create({ user_id, refresh_token: refreshToken })
         return { user_id }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }

   login = async ({ user_id, refreshToken }: Authorization.LoginData): Promise<boolean> => {
      try {
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id })

         return true
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   logout = async ({ user_id }: Authorization.LogoutData): Promise<boolean> => {
      try {
         await this.Tables.Tokens.destroy({ where: { user_id } })
         return true
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   refresh = async ({ user_id, refreshToken }: Authorization.RefreshData): Promise<boolean> => {
      try {
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id })
         return true
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async ({ refreshToken, user_id, password }: Authorization.ForgotPasswordData): Promise<boolean> => {
      try {
         await this.Tables.Users.update({ password }, { where: { user_id } })
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id })

         return true
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
