import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokensProto, AuthorizationProto } from 'proto-for-store'
import {
   ForgotPasswordData,
   ICredentials,
   LoginData,
   LogoutData,
   LogoutResponse,
   RefreshData,
   RegistrationData,
} from 'types-for-store/dist/authentication-microservice'

// import equivalence from 'types-for-store'

import { ApiError } from 'shared-for-store'

interface ControllerArgs {
   TokensClient: Awaited<ReturnType<typeof TokensProto.createTokensClient>>
   AuthClient: Awaited<ReturnType<typeof AuthorizationProto.createAuthorizationClient>>
}

type ICredentialsWithRefToken = ICredentials & { refreshToken?: string }

class UserController {
   private readonly TokensClient
   private readonly AuthClient

   constructor({ TokensClient, AuthClient }: ControllerArgs) {
      this.TokensClient = TokensClient
      this.AuthClient = AuthClient
   }

   registration = async (
      req: Request<ParamsDictionary, ICredentials, RegistrationData>,
      res: Response<ICredentials>,
      next: NextFunction
   ): Promise<void> => {
      try {
         const errors = validationResult(req)

         if (!errors.isEmpty()) throw ApiError.BadRequest('Incorrect data', errors.array())

         const user = await this.AuthClient.AuthorizationRegistration<RegistrationData, ICredentialsWithRefToken>(
            req.body
         )

         if (user?.user_id === -1 || !user?.refreshToken) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })
         delete user.refreshToken

         res.json(user)
      } catch (error) {
         next(error)
      }
   }
   login = async (
      req: Request<ParamsDictionary, ICredentials, LoginData>,
      res: Response<ICredentials>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.AuthClient.AuthorizationLogin<LoginData, ICredentialsWithRefToken>(req.body)

         if (user?.user_id === -1 || !user?.refreshToken) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         delete user.refreshToken

         res.json(user)
      } catch (error) {
         next(error)
      }
   }
   logout = async (
      req: Request<ParamsDictionary, LogoutResponse, LogoutData>,
      res: Response<LogoutResponse>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const isLogout = await this.AuthClient.AuthorizationLogout<LogoutData, LogoutResponse>(req.body)

         if (!isLogout?.value) throw ApiError.ServerError()

         res.clearCookie('refreshToken')

         res.json({ value: true })
      } catch (error) {
         next(error)
      }
   }
   refresh = async (
      req: Request<ParamsDictionary, ICredentials, RefreshData>,
      res: Response<ICredentials>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.AuthClient.AuthorizationRefresh<RefreshData, ICredentialsWithRefToken>(req.body)

         if (user?.user_id === -1 || !user?.refreshToken) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         delete user.refreshToken

         res.json(user)
      } catch (error) {
         next(error)
      }
   }
   forgotPassword = async (
      req: Request<ParamsDictionary, ICredentials, ForgotPasswordData>,
      res: Response<ICredentials>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.AuthClient.AuthorizationForgotPassword<ForgotPasswordData, ICredentialsWithRefToken>(
            req.body
         )
         if (user?.user_id === -1 || !user?.refreshToken) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         delete user.refreshToken

         res.json(user)
      } catch (error) {
         next(error)
      }
   }
}

export default UserController
