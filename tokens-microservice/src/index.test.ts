// const grpc = require('@grpc/grpc-js')
// const protoLoader = require('@grpc/proto-loader')
// const path = require('path')
// const protoFile = path.join(__dirname, '../node_modules', 'proto-for-store', 'tokens', '.proto')
// import { Server } from '@grpc/grpc-js'
// import { ITokens } from 'types-for-store/tokens'

// const tokensController = require('./controllers/tokens-controller')

// const packageDefinition = protoLoader.loadSync(protoFile, {
//    keepCase: true,
//    longs: String,
//    enums: String,
//    defaults: true,
//    oneofs: true,
// })

// const {
//    Tokens: { GenerateTokens, ValidAccessToken, ValidRefreshToken },
// } = grpc.loadPackageDefinition(packageDefinition)

// const server: Server = new grpc.Server()
// async function start(): Promise<number> {
//    try {
//       server.addService(GenerateTokens.service, { generateTokens: tokensController.generateTokens })
//       server.addService(ValidAccessToken.service, { validAccessToken: tokensController.validAccessToken })
//       server.addService(ValidRefreshToken.service, { validRefreshToken: tokensController.validRefreshToken })

//       await server.bindAsync('localhost:65535', grpc.ServerCredentials.createInsecure(), () => {
//          console.log('tokens-microservice')
//       })
//       return 0
//    } catch (error) {
//       console.error('Error starting server:', error)

//       return 1
//    }
// }
// start()

// const generateTokensClient = new GenerateTokens('localhost:65535', grpc.credentials.createInsecure())
// const validAccessTokenClient = new ValidAccessToken('localhost:65535', grpc.credentials.createInsecure())
// const validRefreshTokenClient = new ValidRefreshToken('localhost:65535', grpc.credentials.createInsecure())

// describe('tokens-microservice', () => {
//    let tokens: ITokens.ITokens = { accessToken: '', refreshToken: '' }

//    test('generate-tokens', async () => {
//       await generateTokensClient.generateTokens({}, (err: unknown, response: ITokens.ITokens) => {
//          if (!err) {
//             tokens = response
//             expect(Object.keys(tokens)).toHaveLength(2)
//             expect(tokens).toHaveProperty('accessToken')
//             expect(tokens).toHaveProperty('refreshToken')
//          }
//       })
//    })

//    test('valid-accesstoken', async () => {
//       validAccessTokenClient.validAccessToken({ token: tokens.accessToken }, (err: unknown, response: boolean) => {
//          if (!err) expect(response).toBe(true)
//       })
//    })

//    test('valid-refreshToken', async () => {
//       validRefreshTokenClient.validRefreshToken({ token: tokens.refreshToken }, (err: unknown, response: boolean) => {
//          if (!err) expect(response).toBe(true)
//       })
//    })

//    afterAll(done => {
//       server.forceShutdown()
//       done()
//    })
// })
