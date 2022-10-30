import httpStatusCodes from './httpStatusCodes.js'
import BaseError from './AppError.js'

export default class Api404Error extends BaseError {
     constructor(
          name,
          statusCode = httpStatusCodes.NOT_FOUND,
          description = 'Not found',
          isOperational = true
     ) {
          super(name, statusCode, isOperational, description)
     }
}