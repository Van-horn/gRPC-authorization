import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { ServerUnaryCall, sendUnaryData, handleUnaryCall } from '@grpc/grpc-js'
import { Authorization } from 'types-for-store/dist/master-server'
import equivalence from 'types-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

import UserService from '../services/user-service'

export interface IUserController {
   registration: handleUnaryCall<Authorization.RegistrationData, Authorization.RegistrationRes>
   login: handleUnaryCall<Authorization.LoginData, Authorization.LoginRes>
   logout: handleUnaryCall<Authorization.LogoutData, Authorization.LogoutRes>
   refresh: handleUnaryCall<Authorization.RefreshData, Authorization.RefreshRes>
   forgotPassword: handleUnaryCall<Authorization.ForgotPasswordData, Authorization.ForgotPasswordRes>
}

class UserController implements IUserController {
   private readonly service: UserService

   constructor(sequelize: MySequelize) {
      this.service = new UserService(sequelize)
   }
   registration = async (
      call: ServerUnaryCall<Authorization.RegistrationData, Authorization.RegistrationRes>,
      callback: sendUnaryData<Authorization.RegistrationRes>,
   ): Promise<void> => {
      try {
         if (!call.request?.email || !call.request?.login || !call.request?.password)
            throw ApiError.BadRequest('There are not all data')

         const user = await this.service.registration(call.request)
         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), equivalence.emptyMasterServerUserCred)
      }
   }

   login = async (
      call: ServerUnaryCall<Authorization.LoginData, Authorization.LoginRes>,
      callback: sendUnaryData<Authorization.LoginRes>,
   ): Promise<void> => {
      try {
         if (!call.request?.user_id || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isLogin = await this.service.login(call.request)
         callback(null, { value: isLogin })
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), { value: false })
      }
   }
   logout = async (
      call: ServerUnaryCall<Authorization.LogoutData, Authorization.LogoutRes>,
      callback: sendUnaryData<Authorization.LogoutRes>,
   ): Promise<void> => {
      try {
         if (!call.request?.user_id) throw ApiError.BadRequest('There are not all data')

         const isLogout = await this.service.logout(call.request)
         callback(null, { value: isLogout })
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), { value: false })
      }
   }
   refresh = async (
      call: ServerUnaryCall<Authorization.RefreshData, Authorization.RefreshRes>,
      callback: sendUnaryData<Authorization.RefreshRes>,
   ): Promise<void> => {
      try {
         if (!call.request?.user_id || !call.request?.refreshToken) throw ApiError.BadRequest('There are not all data')

         const isRefresh = await this.service.refresh(call.request)
         callback(null, { value: isRefresh })
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), { value: false })
      }
   }

   forgotPassword = async (
      call: ServerUnaryCall<Authorization.ForgotPasswordData, Authorization.ForgotPasswordRes>,
      callback: sendUnaryData<Authorization.ForgotPasswordRes>,
   ): Promise<void> => {
      try {
         if (!call.request?.user_id || !call.request?.password || !call.request?.refreshToken)
            throw ApiError.BadRequest('There are not all data')

         const isForPas = await this.service.forgotPassword(call.request)
         callback(null, { value: isForPas })
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), { value: false })
      }
   }
}

export default UserController
