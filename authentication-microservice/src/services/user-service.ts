/* eslint-disable no-useless-catch */
const bcrypt = require('bcryptjs')
const { ApiError } = require('shared-for-store')
import { ServiceError } from '@grpc/grpc-js'
import { AuthMicroservice } from 'types-for-store/authentication-microservice'
import { MasterServer } from 'types-for-store/master-server'
import { Tokens } from 'types-for-store/tokens'
import { SlaveServer } from 'types-for-store/slave-server'

const { SlaveServerClient, MasterServerClient, GenTokensClient } = require('../index')

namespace IUserService {
   export interface UserService {
      registration(props: AuthMicroservice.IRegReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }>
      login(props: AuthMicroservice.ILogReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }>
      logout(props: AuthMicroservice.ILogoutReqData): Promise<boolean>
      refresh(props: AuthMicroservice.IRefReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }>
      forgotPassword(props: AuthMicroservice.IForReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }>
   }
}
const getUser = async (props: SlaveServer.IGetUserReqData): Promise<SlaveServer.IUser> =>
   await new Promise<SlaveServer.IUser>((resolve, reject) => {
      SlaveServerClient.getUser(props, (error: ServiceError, response: SlaveServer.IUser) => {
         if (error) return reject(error)
         return resolve(response)
      })
   })

const getTokens = async <T>(props: T): Promise<Tokens.ITokens> =>
   await new Promise<Tokens.ITokens>((resolve, reject) => {
      GenTokensClient.GenerateTokens(props, (error: ServiceError, response: Tokens.ITokens) => {
         if (error) return reject(error)
         return resolve(response)
      })
   })
const writeToken = async (props: MasterServer.IWTokenReqData): Promise<boolean> =>
   await new Promise<boolean>((resolve, reject) => {
      MasterServerClient.writeToken(props, (error: ServiceError, response: boolean) => {
         if (error) return reject(error)
         return resolve(response)
      })
   })

class UserService implements IUserService.UserService {
   async registration({
      email,
      password,
      login,
   }: AuthMicroservice.IRegReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }> {
      try {
         const candidate = await getUser({ email })
         if (candidate) throw ApiError.BadRequest('User already exists')

         const hashPassword = await bcrypt.hash(password, 3)

         const user: MasterServer.IUser = await new Promise<MasterServer.IUser>((resolve, reject) => {
            MasterServerClient.registration(
               { email, login, password: hashPassword },
               (error: ServiceError, response: MasterServer.IUser) => {
                  if (error) return reject(error)
                  resolve(response)
               },
            )
         })
         const tokens = await getTokens<Record<never, never>>({})
         await writeToken({ userId: user.userId, refreshToken: tokens.refreshToken })
         return {
            ...user,
            ...tokens,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async login({
      password,
      email,
   }: AuthMicroservice.ILogReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }> {
      try {
         const dbUser = await getUser({ email })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const isPasswordEquals = await bcrypt.compare(password, dbUser.password)
         if (!isPasswordEquals) throw ApiError.BadRequest('Invalid password')

         const tokens = await getTokens<Record<never, never>>({})
         await writeToken({ userId: dbUser.userId, refreshToken: tokens.refreshToken })

         return { ...dbUser, ...tokens }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async logout({ userId }: AuthMicroservice.ILogoutReqData): Promise<boolean> {
      try {
         await new Promise<boolean>((resolve, reject) => {
            MasterServerClient.logout({ userId }, (error: ServiceError, response: boolean) => {
               if (error) return reject(error)
               resolve(response)
            })
         })
         return true
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async refresh({
      refreshToken,
      userId,
   }: AuthMicroservice.IRefReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }> {
      try {
         const dbUser = await getUser({ userId })

         if (dbUser.refreshToken !== refreshToken) throw ApiError.UnAthorizedError()
         const tokens = await getTokens<Record<never, never>>({})
         await writeToken({ userId: dbUser.userId, refreshToken: tokens.refreshToken })

         return {
            ...dbUser,
            ...tokens,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
   async forgotPassword({
      password,
      email,
   }: AuthMicroservice.IForReqData): Promise<AuthMicroservice.IUser & { refreshToken?: string }> {
      try {
         const dbUser = await getUser({ email })

         if (!dbUser) throw ApiError.BadRequest('There is not user')

         const tokens = await getTokens<Record<never, never>>({})
         await writeToken({ userId: dbUser.userId, refreshToken: tokens.refreshToken })

         const hashPassword = await bcrypt.hash(password, 3)

         await new Promise<boolean>((resolve, reject) => {
            MasterServerClient.forgotPassword(
               {
                  password: hashPassword,
                  userId: dbUser.userId,
                  refreshToken: tokens.refreshToken,
               },
               (error: ServiceError, response: boolean) => {
                  if (error) return reject(error)
                  resolve(response)
               },
            )
         })
         return {
            ...dbUser,
            ...tokens,
         }
      } catch (error) {
         if (error instanceof ApiError) throw error
         throw ApiError.ServerError([error])
      }
   }
}

export default IUserService
module.exports = new UserService()
