import { validationResult } from 'express-validator'
import { AuthorizationController, TokensController } from 'types-for-store'
import { ApiError } from 'shared-for-store'
import { TokensProto, SlaveDBProto, MasterDBProto } from 'proto-for-store'

import UserService from '../services'

interface UserControllerArgs {
   TokensClient: Awaited<ReturnType<typeof TokensProto.createTokensClient>>
   SlaveDBProtoClient: Awaited<ReturnType<typeof SlaveDBProto.createSlaveDBClient>>
   MasterDBProtoClient: Awaited<ReturnType<typeof MasterDBProto.createMasterDBClient>>
}

class UserController implements AuthorizationController.Controller {
   private readonly TokensClient

   private readonly service

   constructor({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient }: UserControllerArgs) {
      this.service = new UserService({ TokensClient, SlaveDBProtoClient, MasterDBProtoClient })
      this.TokensClient = TokensClient
   }

   registration = async (
      ...[req, res, next]: Parameters<AuthorizationController.Controller['registration']>
   ): ReturnType<AuthorizationController.Controller['registration']> => {
      try {
         const errors = validationResult(req)

         if (!errors.isEmpty()) throw ApiError.BadRequest('Incorrect data', errors.array())

         const user = await this.service.registration(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const { refreshToken, ...preperedUser } = user

         res.json(preperedUser)
      } catch (error) {
         next(error)
      }
   }
   login = async (
      ...[req, res, next]: Parameters<AuthorizationController.Controller['login']>
   ): ReturnType<AuthorizationController.Controller['login']> => {
      try {
         if (!req.body?.email || !req.body?.password) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.login(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const { refreshToken, ...preperedUser } = user

         res.json(preperedUser)
      } catch (error) {
         next(error)
      }
   }
   logout = async (
      ...[req, res, next]: Parameters<AuthorizationController.Controller['logout']>
   ): ReturnType<AuthorizationController.Controller['logout']> => {
      try {
         if (!req.body?.accessToken) throw ApiError.BadRequest('There is not all data')

         const refreshTokenFromCookie = req.cookies?.refreshToken

         if (!refreshTokenFromCookie) throw ApiError.UnAthorizedError()

         const accessTokenPayload = await this.TokensClient.TokensAccessTokenValidation<
            TokensController.ValidationRequest,
            TokensController.ValidationResponse
         >({ value: req.body.accessToken })

         if (!accessTokenPayload) throw ApiError.UnAthorizedError()

         const isLogout = await this.service.logout({
            userId: accessTokenPayload.userId,
            refreshToken: refreshTokenFromCookie,
         })

         if (!isLogout) throw ApiError.ServerError()

         res.clearCookie('refreshToken')

         res.json(isLogout)
      } catch (error) {
         next(error)
      }
   }
   refresh = async (
      ...[req, res, next]: Parameters<AuthorizationController.Controller['refresh']>
   ): ReturnType<AuthorizationController.Controller['refresh']> => {
      try {
         const refreshTokenFromCookie = req.cookies?.refreshToken

         if (!refreshTokenFromCookie) throw ApiError.UnAthorizedError()

         const refreshTokenPayload = await this.TokensClient.TokensRefreshTokenValidation<
            TokensController.ValidationRequest,
            TokensController.ValidationResponse
         >({ value: refreshTokenFromCookie })

         if (!refreshTokenPayload) throw ApiError.UnAthorizedError()

         const user = await this.service.refresh({ userId: refreshTokenPayload.userId })

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const { refreshToken, ...preperedUser } = user

         res.json(preperedUser)
      } catch (error) {
         next(error)
      }
   }
   forgotPassword = async (
      ...[req, res, next]: Parameters<AuthorizationController.Controller['forgotPassword']>
   ): ReturnType<AuthorizationController.Controller['forgotPassword']> => {
      try {
         if (!req.body?.email || !req.body?.password) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.forgotPassword(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const { refreshToken, ...preperedUser } = user

         res.json(preperedUser)
      } catch (error) {
         next(error)
      }
   }
}

export default UserController
