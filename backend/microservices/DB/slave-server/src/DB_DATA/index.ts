import { Sequelize } from 'sequelize'

export default new Sequelize(
   process.env.DB_NAME ?? 'STORE',
   process.env.DB_USER ?? 'postgres',
   process.env.DB_PASSWORD ?? 'root',
   {
      dialect: 'postgres',
      host: process.env.DB_HOST ?? 'postgres',
      port: Number(process.env.DB_PORT) ?? 5432,
   },
)
