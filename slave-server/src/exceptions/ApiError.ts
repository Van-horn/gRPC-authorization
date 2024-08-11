module.exports = class ApiError extends Error {
   status: number
   errors: Array<any>

   constructor(status: number, message: string, errors: Array<any> = []) {
      super(message)
      this.status = status
      this.errors = errors
   }
   static UnAthorizedError() {
      return new ApiError(401, 'Пользователь не авторизован')
   }
   static BadRequest(message: string, errors: Array<any> = []) {
      return new ApiError(400, message, errors)
   }
}
