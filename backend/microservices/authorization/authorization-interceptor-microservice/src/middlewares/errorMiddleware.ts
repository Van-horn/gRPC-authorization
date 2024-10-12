import { Request, Response, NextFunction } from 'express'

import { ApiError } from 'shared-for-store'

export default (err: ApiError | unknown, req: Request, res: Response, next: NextFunction): void => {
   if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message, errors: err.errors })
   }
   res.status(500).json({ message: 'Непредвиденная ошибка' })
}
