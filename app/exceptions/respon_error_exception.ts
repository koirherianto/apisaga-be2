import { Exception } from '@adonisjs/core/exceptions'

export default class ResponErrorException extends Exception {
  static success = false
  static status = 500
}
