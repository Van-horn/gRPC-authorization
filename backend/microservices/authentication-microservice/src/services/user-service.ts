import { hash, compare } from 'bcrypt'
import { MasterDBProto, SlaveDBProto, TokensProto } from 'proto-for-store'
import { ApiError } from 'shared-for-store'
import {
   ForgotPasswordData,
   ICredentials,
   LoginData,
   LogoutData,
   RefreshData,
   RegistrationData,
} from 'types-for-store/dist/authentication-microservice'
import { Users } from 'types-for-store/dist/slave-server'
import { ITokens, TokenGenerationRequest } from 'types-for-store/dist/tokens-microservice'
import { Authorization } from 'types-for-store/dist/master-server'

type ICredentialsWithRefToken = ICredentials & { refreshToken?: string }

interface IUserService {
   registration(props: RegistrationData): Promise<ICredentialsWithRefToken>
   login(props: LoginData): Promise<ICredentialsWithRefToken>
   logout(props: LogoutData): Promise<boolean>
   refresh(props: RefreshData): Promise<ICredentialsWithRefToken>
   forgotPassword(props: ForgotPasswordData): Promise<ICredentialsWithRefToken>
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

   registration = async ({ email, password, login }: RegistrationData): Promise<ICredentialsWithRefToken> => {
      try {
         const candidate = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ email })

         if (candidate) throw ApiError.BadRequest('User already exists')

         const hashPassword = await hash(password, 3)

         const tokens = await this.TokensClient.TokensGenerateTokens<TokenGenerationRequest, ITokens>({})

         if (!tokens?.refreshToken) throw ApiError.ServerError()

         const userId = await this.MasterDBProtoClient.AuthorizationRegistration<
            Authorization.RegistrationData,
            Authorization.RegistrationRes
         >({ email, login, refreshToken: tokens.refreshToken, password: hashPassword })

         if (!userId?.user_id) throw ApiError.ServerError()

         return {
            ...tokens,
            email,
            login,
            user_id: userId.user_id,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   login = async ({ password, email }: LoginData): Promise<ICredentialsWithRefToken> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ email })

         if (dbUser?.user_id === -1 || !dbUser?.password) throw ApiError.BadRequest('There is not user')

         const isPasswordEquals = await compare(password, dbUser.password)
         if (!isPasswordEquals) throw ApiError.BadRequest('Invalid email or password')

         const tokens = await this.TokensClient.TokensGenerateTokens<TokenGenerationRequest, ITokens>({})

         if (!tokens?.refreshToken) throw ApiError.ServerError()

         const isLogin = await this.MasterDBProtoClient.AuthorizationLogin<
            Authorization.LoginData,
            Authorization.LoginRes
         >({
            user_id: dbUser.user_id,
            refreshToken: tokens.refreshToken,
         })
         if (!isLogin?.value) throw ApiError.ServerError()

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

         if (!isLogout?.value) throw ApiError.ServerError()

         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   refresh = async ({ refreshToken, user_id }: RefreshData): Promise<ICredentialsWithRefToken> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({ user_id })

         if (dbUser?.user_id === -1 || !dbUser) throw ApiError.UnAthorizedError()

         const tokens = await this.TokensClient.TokensGenerateTokens<TokenGenerationRequest, ITokens>({})

         if (!tokens?.refreshToken) throw ApiError.ServerError()

         const isRefresh = await this.MasterDBProtoClient.AuthorizationRefresh<
            Authorization.RefreshData,
            Authorization.RefreshRes
         >({ user_id, refreshToken })

         return { ...tokens, user_id, email: dbUser.email, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   forgotPassword = async ({ password, email }: ForgotPasswordData): Promise<ICredentialsWithRefToken> => {
      try {
         const dbUser = await this.SlaveDBProtoClient.UsersUserCredentials<
            Users.UserCredGetData,
            Users.UserCredentials
         >({
            email,
         })
         if (dbUser?.user_id === -1 || !dbUser) throw ApiError.BadRequest('There is not user')

         const tokens = await this.TokensClient.TokensGenerateTokens<TokenGenerationRequest, ITokens>({})

         if (!tokens?.refreshToken) throw ApiError.ServerError()

         const hashPassword = await hash(password, 3)

         const isForPas = await this.MasterDBProtoClient.AuthorizationForgotPassword<
            Authorization.ForgotPasswordData,
            Authorization.ForgotPasswordRes
         >({ user_id: dbUser.user_id, password: hashPassword, refreshToken: tokens.refreshToken })
         return { ...tokens, email, user_id: dbUser.user_id, login: dbUser.login }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default UserService
