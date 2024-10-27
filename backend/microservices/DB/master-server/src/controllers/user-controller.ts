import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { MasterServerUserController } from 'types-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

import UserService from '../services/user-service'

class UserController implements MasterServerUserController.Controller {
   private readonly service: UserService

   constructor(sequelize: MySequelize) {
      this.service = new UserService(sequelize)
   }
   registration = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['registration']>
   ): Promise<ReturnType<MasterServerUserController.Controller['registration']>> => {
      try {
         if (!call.request?.email || !call.request?.login || !call.request?.password)
            throw ApiError.BadRequest('There are not all data')

         const user = await this.service.registration(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
   writeToken = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['writeToken']>
   ): Promise<ReturnType<MasterServerUserController.Controller['writeToken']>> => {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isWriteToken = await this.service.writeToken(call.request)

         callback(null, isWriteToken)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }

   login = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['login']>
   ): Promise<ReturnType<MasterServerUserController.Controller['login']>> => {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isLogin = await this.service.login(call.request)
         callback(null, isLogin)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
   logout = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['logout']>
   ): Promise<ReturnType<MasterServerUserController.Controller['logout']>> => {
      try {
         if (!call.request?.userId) throw ApiError.BadRequest('There are not all data')

         const isLogout = await this.service.logout(call.request)
         callback(null, isLogout)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
   refresh = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['refresh']>
   ): Promise<ReturnType<MasterServerUserController.Controller['refresh']>> => {
      try {
         if (!call.request?.userId || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isRefresh = await this.service.refresh(call.request)
         callback(null, isRefresh)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }

   forgotPassword = async (
      ...[call, callback]: Parameters<MasterServerUserController.Controller['forgotPassword']>
   ): Promise<ReturnType<MasterServerUserController.Controller['forgotPassword']>> => {
      try {
         if (!call.request?.userId || !call.request?.password || !call.request?.refreshToken)
            throw ApiError.BadRequest('There are not all data')

         const isForPas = await this.service.forgotPassword(call.request)
         callback(null, isForPas)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error))
      }
   }
}

export default UserController
