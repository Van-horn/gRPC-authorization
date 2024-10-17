import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
   ForgotPasswordData,
   Credentials,
   LoginData,
   LogoutData,
   LogoutResponse,
   RefreshData,
   RegistrationData,
} from 'types-for-store/src/authentication-microservice'
import { ApiError } from 'shared-for-store'
import { TokensProto, SlaveDBProto, MasterDBProto } from 'proto-for-store'

import UserService from '../services'

interface IUserController {
   registration:(
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, RegistrationData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   )=> Promise<void>
   login:(
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, LoginData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   )=> Promise<void>
   logout:(
      req: Request<ParamsDictionary, LogoutResponse, LogoutData>,
      res: Response<LogoutResponse>,
      next: NextFunction
   )=> Promise<void>
   refresh : (
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, RefreshData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   )=> Promise<void>
   forgotPassword :  (
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, ForgotPasswordData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   )=> Promise<void> 
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
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, RegistrationData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   ): Promise<void> => {
      try {
         const errors = validationResult(req)
         
         if (!errors.isEmpty()) throw ApiError.BadRequest('Incorrect data', errors.array())

         const user = await this.service.registration(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const {refreshToken,...userForSending} =user

         res.json(userForSending)
      } catch (error) {
         next(error)
      }
   }
   login = async (
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, LoginData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.login(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const {refreshToken,...userForSending} =user

         res.json(userForSending)
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

         const isLogout = await this.service.logout(req.body)

         if (!isLogout) throw ApiError.ServerError()

         res.clearCookie('refreshToken')

         res.json({ value: true })
      } catch (error) {
         next(error)
      }
   }
   refresh = async (
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, RefreshData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.refresh(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })

         const {refreshToken,...userForSending} =user

         res.json(userForSending)
      } catch (error) {
         next(error)
      }
   }
   forgotPassword = async (
      req: Request<ParamsDictionary, Omit<Credentials,"refreshToken">, ForgotPasswordData>,
      res: Response<Omit<Credentials,"refreshToken">>,
      next: NextFunction
   ): Promise<void> => {
      try {
         if (!req.body) throw ApiError.BadRequest('There is not all data')

         const user = await this.service.forgotPassword(req.body)

         if (!user) throw ApiError.ServerError()

         res.cookie('refreshToken', user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         })
         const {refreshToken,...userForSending} =user

         res.json(userForSending)
      } catch (error) {
         next(error)
      }
   }
}

export default UserController
