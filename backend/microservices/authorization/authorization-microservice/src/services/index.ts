import { hash, compare } from 'bcryptjs'
import { MasterDBProto, SlaveDBProto, TokensProto } from 'proto-for-store'
import { ApiError } from 'shared-for-store'
import {
   AuthorizationService,
   TokensController,
   SlaveServerUserController,
   MasterServerUserController,
} from 'types-for-store'

interface UserServiceArgs {
   TokensClient: Awaited<ReturnType<typeof TokensProto.createTokensClient>>
   SlaveDBProtoClient: Awaited<ReturnType<typeof SlaveDBProto.createSlaveDBClient>>
   MasterDBProtoClient: Awaited<ReturnType<typeof MasterDBProto.createMasterDBClient>>
}

class UserService implements AuthorizationService.Service {
   private readonly TokensClient
   private readonly SlaveDBProtoClient
   private readonly MasterDBProtoClient

   constructor({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient }: UserServiceArgs) {
      this.TokensClient = TokensClient
      this.SlaveDBProtoClient = SlaveDBProtoClient
      this.MasterDBProtoClient = MasterDBProtoClient
   }

   registration = async (
      ...[{ email, password, login }]: Parameters<AuthorizationService.Service['registration']>
   ): ReturnType<AuthorizationService.Service['registration']> => {
      try {
         const candidate = await this.SlaveDBProtoClient.UsersUserCredentials<
            SlaveServerUserController.CredentialsRequest,
            SlaveServerUserController.CredentialsResponse
         >({ email })

         if (candidate) throw ApiError.BadRequest('User already exists')

         const hashPassword = await hash(password, 3)

         const user = await this.MasterDBProtoClient.AuthorizationRegistration<
            MasterServerUserController.RegistrationRequest,
            MasterServerUserController.RegistrationResponse
         >({ email, login, password: hashPassword })

         if (!user) throw ApiError.ServerError()

         const tokens = await this.TokensClient.TokensGenerateTokens<
            TokensController.GenerateTokensRequest,
            TokensController.GenerateTokensResponse
         >({ userId: user.userId })

         if (!tokens) throw ApiError.ServerError()

         const isWriteToken = await this.MasterDBProtoClient.AuthorizationWriteToken<
            MasterServerUserController.WriteTokenRequest,
            MasterServerUserController.WriteTokenResponse
         >({ userId: user.userId, refreshToken: tokens.refreshToken })

         if (!isWriteToken) throw ApiError.ServerError()

         return {
            ...tokens,
            email,
            login,
            userId: user.userId,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   login = async (
      ...[{ password, email }]: Parameters<AuthorizationService.Service['login']>
   ): ReturnType<AuthorizationService.Service['login']> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            SlaveServerUserController.CredentialsRequest,
            SlaveServerUserController.CredentialsResponse
         >({ email })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const isPasswordEquals = await compare(password, dbUser.password)
         if (!isPasswordEquals) throw ApiError.BadRequest('Invalid email or password')

         const tokens = await this.TokensClient.TokensGenerateTokens<
            TokensController.GenerateTokensRequest,
            TokensController.GenerateTokensResponse
         >({ userId: dbUser.userId })

         if (!tokens) throw ApiError.ServerError()

         const isLogin = await this.MasterDBProtoClient.AuthorizationLogin<
            MasterServerUserController.LoginRequest,
            MasterServerUserController.LoginResponse
         >({
            userId: dbUser.userId,
            refreshToken: tokens.refreshToken,
         })
         if (!isLogin) throw ApiError.ServerError()

         return { ...tokens, email, userId: dbUser.userId, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   logout = async (
      ...[{ userId, refreshToken }]: Parameters<AuthorizationService.Service['logout']>
   ): ReturnType<AuthorizationService.Service['logout']> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            SlaveServerUserController.CredentialsRequest,
            SlaveServerUserController.CredentialsResponse
         >({ userId })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         if (dbUser.refreshToken !== refreshToken) throw ApiError.BadRequest('No access rights')

         const isLogout = await this.MasterDBProtoClient.AuthorizationLogout<
            MasterServerUserController.LogoutRequest,
            MasterServerUserController.LogoutResponse
         >({ userId })

         if (!isLogout) throw ApiError.ServerError()

         return { userId: -1, email: '', login: '', accessToken: '' }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   refresh = async (
      ...[{ userId }]: Parameters<AuthorizationService.Service['refresh']>
   ): ReturnType<AuthorizationService.Service['refresh']> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            SlaveServerUserController.CredentialsRequest,
            SlaveServerUserController.CredentialsResponse
         >({ userId })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const tokens = await this.TokensClient.TokensGenerateTokens<
            TokensController.GenerateTokensRequest,
            TokensController.GenerateTokensResponse
         >({ userId: dbUser.userId })

         if (!tokens) throw ApiError.ServerError()

         const isRefresh = await this.MasterDBProtoClient.AuthorizationRefresh<
            MasterServerUserController.RefreshRequest,
            MasterServerUserController.RefreshResponse
         >({ userId, refreshToken: tokens.refreshToken })

         if (!isRefresh) throw ApiError.ServerError()

         return { ...tokens, userId, email: dbUser.email, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async (
      ...[{ password, email }]: Parameters<AuthorizationService.Service['forgotPassword']>
   ): ReturnType<AuthorizationService.Service['forgotPassword']> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            SlaveServerUserController.CredentialsRequest,
            SlaveServerUserController.CredentialsResponse
         >({
            email,
         })
         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const tokens = await this.TokensClient.TokensGenerateTokens<
            TokensController.GenerateTokensRequest,
            TokensController.GenerateTokensResponse
         >({ userId: dbUser.userId })

         if (!tokens) throw ApiError.ServerError()

         const hashPassword = await hash(password, 3)

         const isForPas = await this.MasterDBProtoClient.AuthorizationForgotPassword<
            MasterServerUserController.ForgotPasswordRequest,
            MasterServerUserController.ForgotPasswordResponse
         >({ userId: dbUser.userId, password: hashPassword, refreshToken: tokens.refreshToken })

         if (!isForPas) throw ApiError.ServerError()

         return { ...tokens, email, userId: dbUser.userId, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
