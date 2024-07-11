import User from '#models/user'
import { loginValidator, registerValidator, updateProfileValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseError from '#exceptions/respon_error_exception'

// import ResponseError from '#exceptions/'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const validate = await request.validateUsing(registerValidator)

    const isEmailExist = await User.findBy('email', validate.email)
    const isUsernameExist = await User.findBy('username', validate.username)

    if (isEmailExist) {
      throw new ResponseError('Email already registered', { status: 400 })
    }

    if (isUsernameExist) {
      throw new ResponseError('Username already registered', { status: 400 })
    }

    const user = await User.create(validate)
    const token = await User.accessTokens.create(user)

    if (user.$isPersisted) {
      return response.status(201).json({
        success: true,
        data: user,
        token: token,
        message: 'User created successfully',
      })
    }

    throw new ResponseError('Email already registered', { status: 400 })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.findBy('email', email)

    if (!user || user === null) {
      throw new ResponseError('Email or password is wrong', { status: 401 })
    }

    const isVerify = await hash.verify(user!.password, password)

    if (isVerify) {
      const token = await User.accessTokens.create(user!)

      return response.status(200).json({
        success: true,
        data: user,
        token: token,
        message: 'Login successfully',
      })
    }

    throw new ResponseError('Email or password is wrong', { status: 401 })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.status(200).json({
      success: true,
      data: user,
      message: 'User data retrieved successfully',
    })
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const validate = await request.validateUsing(updateProfileValidator)

    if (validate.email) {
      const isEmailExist = await User.findBy('email', validate.email)

      if (isEmailExist && isEmailExist.id !== user.id) {
        throw new ResponseError('Email already registered', { status: 400 })
      }
    }

    if (validate.username) {
      const isUsernameExist = await User.findBy('username', validate.username)

      if (isUsernameExist && isUsernameExist.id !== user.id) {
        throw new ResponseError('Username already registered', { status: 400 })
      }
    }

    // remove password if empty
    if (!(validate.password !== undefined && validate.password !== '')) {
      delete validate.password
    }

    user.merge(validate)

    return response.status(200).json({
      success: true,
      data: user,
      message: 'User data updated successfully',
    })
  }

  async logout({ auth, response }: HttpContext) {
    const getUser = auth.user?.id
    const user = await User.findOrFail(getUser)
    const token = auth.user?.currentAccessToken.identifier

    if (!token) {
      return response.badRequest({
        success: false,
        message: 'Token not found',
      })
    }
    await User.accessTokens.delete(user, token)

    return response.ok({
      success: true,
      userId: user.id,
      message: 'Logout successfully',
    })
  }
}
