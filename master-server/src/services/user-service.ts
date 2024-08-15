/* eslint-disable no-useless-catch */

const { UsersSchema, TokensSchema } = require('../DB_DATA/models')
const { ApiError } = require('shared-for-store')
import { MasterServer } from 'types-for-store/master-server'

namespace IUserService {
   export interface IUserService {
      registration(props: MasterServer.IRegReqData): Promise<MasterServer.IUser>
      login(props: MasterServer.ILogReqData): Promise<boolean>
      logout(props: MasterServer.ILogoutReqData): Promise<boolean>
      refresh(props: MasterServer.IRefReqData): Promise<boolean>
      forgotPassword(props: MasterServer.IForReqData): Promise<boolean>
   }
}

class UserService implements IUserService.IUserService {
   async registration({ refreshToken, ...props }: MasterServer.IRegReqData): Promise<MasterServer.IUser> {
      try {
         const {
            dataValues: { userId, createdAt },
         } = await UsersSchema.create(props)
         await TokensSchema.create({ userId, refreshToken })
         return {
            ...props,
            userId,
            createdAt,
            refreshToken,
            favorites: [],
            ratings: [],
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async login({ userId, refreshToken }: MasterServer.ILogReqData): Promise<boolean> {
      try {
         await TokensSchema.upsert({ refreshToken }, { where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async logout({ userId }: MasterServer.ILogoutReqData): Promise<boolean> {
      try {
         await TokensSchema.destroy({ where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async refresh({ userId, refreshToken }: MasterServer.IRefReqData): Promise<boolean> {
      try {
         await TokensSchema.update({ refreshToken }, { where: { userId } })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async forgotPassword({ userId, password, refreshToken }: MasterServer.IForReqData): Promise<boolean> {
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

module.exports = new UserService()
