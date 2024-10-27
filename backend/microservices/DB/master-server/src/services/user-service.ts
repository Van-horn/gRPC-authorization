import { MySequelize } from 'db-for-store/dist/tables'
import { ApiError } from 'shared-for-store'
import { MasterServerUserService } from 'types-for-store'

class UserService implements MasterServerUserService.Service {
   private readonly sequelize: MySequelize
   private readonly Tables: MySequelize['models']

   constructor(sequelize: MySequelize) {
      this.sequelize = sequelize
      this.Tables = this.sequelize.models
   }

   registration = async (
      ...[props]: Parameters<MasterServerUserService.Service['registration']>
   ): ReturnType<MasterServerUserService.Service['registration']> => {
      try {
         const {
            dataValues: { user_id },
         } = await this.Tables.Users.create(props)

         return { userId: user_id }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   writeToken = async (
      ...[{ refreshToken, userId }]: Parameters<MasterServerUserService.Service['writeToken']>
   ): ReturnType<MasterServerUserService.Service['writeToken']> => {
      try {
         await this.Tables.Tokens.create({ user_id: userId, refresh_token: refreshToken })

         return { value: true }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }

   login = async (
      ...[{ userId, refreshToken }]: Parameters<MasterServerUserService.Service['login']>
   ): ReturnType<MasterServerUserService.Service['login']> => {
      try {
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id: userId })

         return { value: true }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   logout = async (
      ...[{ userId }]: Parameters<MasterServerUserService.Service['logout']>
   ): ReturnType<MasterServerUserService.Service['logout']> => {
      try {
         await this.Tables.Tokens.destroy({ where: { user_id: userId } })
         return { value: true }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   refresh = async (
      ...[{ userId, refreshToken }]: Parameters<MasterServerUserService.Service['refresh']>
   ): ReturnType<MasterServerUserService.Service['refresh']> => {
      try {
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id: userId })
         return { value: true }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async (
      ...[{ refreshToken, userId, password }]: Parameters<MasterServerUserService.Service['forgotPassword']>
   ): ReturnType<MasterServerUserService.Service['forgotPassword']> => {
      try {
         await this.Tables.Users.update({ password }, { where: { user_id: userId } })
         await this.Tables.Tokens.upsert({ refresh_token: refreshToken, user_id: userId })

         return { value: true }
      } catch (error) {
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
