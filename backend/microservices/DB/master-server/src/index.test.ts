// import { ApiError } from 'shared-for-store'
// import { MasterDBProto } from 'proto-for-store'
// import { Server } from '@grpc/grpc-js'
// import { Users } from 'types-for-store/dist/slave-server'
// import equivalence from 'types-for-store'
// import { Authorization } from 'types-for-store/dist/master-server'

// import UserController from './controllers/user-controller'
// import GetSequelize from './DB_DATA'

// const sequelize = GetSequelize('test')

// const { refresh, registration, forgotPassword, login, logout } = new UserController(sequelize)

// async function server(): Promise<Server> {
//    try {
//       const TestServer = await MasterDBProto.createMasterDBServer({
//          url: `0.0.0.0:5000`,
//          ServiceHandlers: {
//             Authorization: { refresh, login, logout, registration, forgotPassword },
//          },
//       })

//       return TestServer
//    } catch (error) {
//       throw ApiError.ServerError([error])
//    }
// }

// test('slave-server', async () => {
//    const TestServer = await server()

//    await sequelize.authenticate()
//    await sequelize.sync({ logging: false })

//    const { AuthorizationRegistration } = await MasterDBProto.createMasterDBClient({ url: '0.0.0.0:5000' })

//    const userRegistrationCred = await AuthorizationRegistration<
//       Authorization.RegistrationData,
//       Authorization.RegistrationRes
//    >({
//       email: 'test1',
//       login: 'test1',
//       password: 'test1',
//       refreshToken: 'test1',
//    })
//    console.log(userRegistrationCred)
//    sequelize.close()
//    TestServer.forceShutdown()
// }, 20000)
