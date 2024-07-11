import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).toLowerCase(),
    email: vine.string().trim().email(),
    username: vine.string().trim().minLength(4).toLowerCase(),
    password: vine.string().trim().minLength(6),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)

export const idValidator = vine.number()
