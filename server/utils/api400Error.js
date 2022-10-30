import httpStatusCodes from './httpStatusCodes.js'
import BaseError from './AppError.js'

export default class Api400Error extends BaseError {
     constructor(
          name,
          statusCode = httpStatusCodes.BAD_REQUEST,
          description = 'Bad Request',
          isOperational = false
     ) {
          super(name, statusCode, isOperational, description)
     }
}