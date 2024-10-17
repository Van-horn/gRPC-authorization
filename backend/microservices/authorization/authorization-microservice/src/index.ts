import express from 'express'
import cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { ApiError } from 'shared-for-store'
import { body } from 'express-validator'
import { MasterDBProto, SlaveDBProto, TokensProto } from 'proto-for-store'

import { config } from 'dotenv'
config({ path: resolve(__dirname, './.env') })

import errorMiddleware from './middlewares/errorMiddleware'
import UserController from './controllers'

const app = express()
app.use(express.json())
app.use(cookieParser())

const router = express.Router()

async function main(): Promise<void> {
   try {
      const TokensClient = await TokensProto.createTokensClient({ url: 'tokens-microservice:8080' })
      const SlaveDBProtoClient = await SlaveDBProto.createSlaveDBClient({ url: 'slave-server:8080' })
      const MasterDBProtoClient = await MasterDBProto.createMasterDBClient({ url: 'master-server:8080' })

      const { registration, login, logout, forgotPassword, refresh } = new UserController({
         SlaveDBProtoClient,
         MasterDBProtoClient,
         TokensClient,
      })

      router.post(
         '/registration',
         body('email').isEmail(),
         body('login').isLength({ min: 4, max: 10 }),
         body('password').isLength({ min: 4, max: 10 }),
         registration
      )
      router.patch('/login', login)
      router.patch('/logout', logout)
      router.patch('/refresh', refresh)
      router.patch('/forgotPassword', forgotPassword)

      app.use('/', router)
      app.use(errorMiddleware)

      app.listen(process.env.PORT ?? 8080, () => {
         console.log(`authorization-microservice`)
      })
   } catch (error) {
      throw ApiError.ServerError([error])
   }
}
main()
