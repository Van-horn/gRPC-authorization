import { ApiError, grpcErrorHandler } from 'shared-for-store'
import { handleUnaryCall, Metadata, sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import {
   ForgotPasswordData,
   ICredentials,
   LoginData,
   LogoutData,
   LogoutResponse,
   RefreshData,
   RegistrationData,
} from 'types-for-store/dist/authentication-microservice'
import { TokensProto, SlaveDBProto, MasterDBProto } from 'proto-for-store'
import equivalence from 'types-for-store'

import UserService from '../services/user-service'

interface IUserController {
   registration: handleUnaryCall<RegistrationData, ICredentials>
   login: handleUnaryCall<LoginData, ICredentials>
   logout: handleUnaryCall<LogoutData, LogoutResponse>
   refresh: handleUnaryCall<RefreshData, ICredentials>
   forgotPassword: handleUnaryCall<ForgotPasswordData, ICredentials>
}

interface UserControllerArgs {
   TokensClient: Awaited<ReturnType<typeof TokensProto.createTokensClient>>
   SlaveDBProtoClient: Awaited<ReturnType<typeof SlaveDBProto.createSlaveDBClient>>
   MasterDBProtoClient: Awaited<ReturnType<typeof MasterDBProto.createMasterDBClient>>
}

class UserController implements IUserController {
   private readonly TokensClient
   private readonly SlaveDBProtoClient
   private readonly MasterDBProtoClient
   private readonly service

   constructor({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient }: UserControllerArgs) {
      this.service = new UserService({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient })
      this.TokensClient = TokensClient
      this.SlaveDBProtoClient = SlaveDBProtoClient
      this.MasterDBProtoClient = MasterDBProtoClient
   }

   registration = async (
      call: ServerUnaryCall<RegistrationData, ICredentials>,
      callback: sendUnaryData<ICredentials>
   ): Promise<void> => {
      try {
         console.log('auth-c-0')
         if (!call.request?.email || !call.request?.password || !call.request?.login)
            throw ApiError.BadRequest('There are not all data')
         console.log('auth-c-1')
         const user = await this.service.registration(call.request)
         console.log('auth-c-2')

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), equivalence.emptyAuthUserCred)
      }
   }
   login = async (
      call: ServerUnaryCall<LoginData, ICredentials>,
      callback: sendUnaryData<ICredentials>
   ): Promise<void> => {
      try {
         if (!call.request?.email || !call.request?.password) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.login(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), equivalence.emptyAuthUserCred)
      }
   }
   logout = async (
      call: ServerUnaryCall<LogoutData, LogoutResponse>,
      callback: sendUnaryData<LogoutResponse>
   ): Promise<void> => {
      try {
         if (!call.request?.user_id) throw ApiError.BadRequest('There is not all data')

         await this.service.logout(call.request)

         callback(null, { value: true })
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), { value: false })
      }
   }
   refresh = async (
      call: ServerUnaryCall<RefreshData, ICredentials>,
      callback: sendUnaryData<ICredentials>
   ): Promise<void> => {
      try {
         if (!call.request?.user_id) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.refresh(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), equivalence.emptyAuthUserCred)
      }
   }
   forgotPassword = async (
      call: ServerUnaryCall<ForgotPasswordData, ICredentials>,
      callback: sendUnaryData<ICredentials>
   ): Promise<void> => {
      try {
         if (!call.request?.email || !call.request?.password) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.forgotPassword(call.request)

         callback(null, user)
      } catch (error) {
         if (error instanceof ApiError) callback(grpcErrorHandler(error), equivalence.emptyAuthUserCred)
      }
   }
}

export default UserController
