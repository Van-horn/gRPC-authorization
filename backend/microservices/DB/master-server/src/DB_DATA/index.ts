import { Sequelize } from 'sequelize'
import { GetSchemes } from 'db-for-store'
import { MySequelize } from 'db-for-store/dist/tables'

type Arg = 'test' | 'production'

const sequelizes = {
   test: GetSchemes(
      new Sequelize('STORE', 'postgres', 'root', {
         dialect: 'postgres',
         host: 'localhost',
         port: 5001,
      }),
   ),
   production: GetSchemes(
      new Sequelize(
         process.env.DB_NAME ?? 'STORE',
         process.env.DB_USER ?? 'postgres',
         process.env.DB_PASSWORD ?? 'root',
         {
            dialect: 'postgres',
            host: process.env.DB_HOST ?? 'postgres',
            port: Number(process.env.DB_PORT) ?? 5432,
         },
      ),
   ),
} satisfies Record<Arg, MySequelize>

export default (arg: Arg): MySequelize => {
   return sequelizes[arg]
}
