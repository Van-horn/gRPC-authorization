import { hash, compare } from 'bcryptjs'
import { MasterDBProto, SlaveDBProto, TokensProto } from 'proto-for-store'
import { ApiError } from 'shared-for-store'
import {
   ForgotPasswordData,
   Credentials,
   LoginData,
   LogoutData,
   RefreshData,
   RegistrationData,
} from 'types-for-store/src/authentication-microservice'
import { Users } from 'types-for-store/src/slave-server'
import { GenerationResponse, GenerationRequest } from 'types-for-store/src/tokens-microservice'
import { Authorization } from 'types-for-store/src/master-server'

interface IUserService {
   registration(props: RegistrationData): Promise<Credentials>
   login(props: LoginData): Promise<Credentials>
   logout(props: LogoutData): Promise<boolean>
   refresh(props: RefreshData): Promise<Credentials>
   forgotPassword(props: ForgotPasswordData): Promise<Credentials>
}

interface UserServiceArgs {
   TokensClient: Awaited<ReturnType<typeof TokensProto.createTokensClient>>
   SlaveDBProtoClient: Awaited<ReturnType<typeof SlaveDBProto.createSlaveDBClient>>
   MasterDBProtoClient: Awaited<ReturnType<typeof MasterDBProto.createMasterDBClient>>
}

class UserService implements IUserService {
   private readonly TokensClient
   private readonly SlaveDBProtoClient
   private readonly MasterDBProtoClient

   constructor({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient }: UserServiceArgs) {
      this.TokensClient = TokensClient
      this.SlaveDBProtoClient = SlaveDBProtoClient
      this.MasterDBProtoClient = MasterDBProtoClient
   }

   registration = async ({ email, password, login }: RegistrationData): Promise<Credentials> => {
      try {
         const candidate = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ email })

         if (candidate) throw ApiError.BadRequest('User already exists')

         const hashPassword = await hash(password, 3)

         const tokens = await this.TokensClient.TokensGenerateTokens<GenerationRequest, GenerationResponse>({})

         if (!tokens) throw ApiError.ServerError()

         const user = await this.MasterDBProtoClient.AuthorizationRegistration<
            Authorization.RegistrationData,
            Authorization.RegistrationRes
         >({ email, login, refreshToken: tokens.refreshToken, password: hashPassword })

         if (!user) throw ApiError.ServerError()

         return {
            ...tokens,
            email,
            login,
            user_id: user.user_id,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   login = async ({ password, email }: LoginData): Promise<Credentials> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ email })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const isPasswordEquals = await compare(password, dbUser.password)
         if (!isPasswordEquals) throw ApiError.BadRequest('Invalid email or password')

         const tokens = await this.TokensClient.TokensGenerateTokens<GenerationRequest, GenerationResponse>({})

         if (!tokens) throw ApiError.ServerError()

         const isLogin = await this.MasterDBProtoClient.AuthorizationLogin<
            Authorization.LoginData,
            Authorization.LoginRes
         >({
            user_id: dbUser.user_id,
            refreshToken: tokens.refreshToken,
         })
         if (!isLogin) throw ApiError.ServerError()

         return { ...tokens, email, user_id: dbUser.user_id, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   logout = async ({ user_id }: LogoutData): Promise<boolean> => {
      try {
         const isLogout = await this.MasterDBProtoClient.AuthorizationLogout<
            Authorization.LogoutData,
            Authorization.LogoutRes
         >({ user_id })

         if (!isLogout) throw ApiError.ServerError()

         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   refresh = async ({ user_id }: RefreshData): Promise<Credentials> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ user_id })

         if (!dbUser) throw ApiError.UnAthorizedError()

         const tokens = await this.TokensClient.TokensGenerateTokens<GenerationRequest, GenerationResponse>({})

         if (!tokens) throw ApiError.ServerError()

         const isRefresh = await this.MasterDBProtoClient.AuthorizationRefresh<
            Authorization.RefreshData,
            Authorization.RefreshRes
         >({ user_id, refreshToken: tokens.refreshToken })

         if (!isRefresh) throw ApiError.ServerError()

         return { ...tokens, user_id, email: dbUser.email, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async ({ password, email }: ForgotPasswordData): Promise<Credentials> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({
            email,
         })
         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const tokens = await this.TokensClient.TokensGenerateTokens<GenerationRequest, GenerationResponse>({})

         if (!tokens) throw ApiError.ServerError()

         const hashPassword = await hash(password, 3)

         const isForPas = await this.MasterDBProtoClient.AuthorizationForgotPassword<
            Authorization.ForgotPasswordData,
            Authorization.ForgotPasswordRes
         >({ user_id: dbUser.user_id, password: hashPassword, refreshToken: tokens.refreshToken })

         if (!isForPas) throw ApiError.ServerError()

         return { ...tokens, email, user_id: dbUser.user_id, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
