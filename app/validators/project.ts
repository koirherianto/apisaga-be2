import vine from '@vinejs/vine'
import ResponseError from '#exceptions/respon_error_exception'

export const projectIdValidator = vine.compile(
  vine
    .string()
    .uuid({ version: [4] })
    .exists(async (db, value) => {
      const row = await db.from('projects').where('id', value).first()
      if (!row) {
        throw new ResponseError('Project not found', { status: 404 })
      }
      return row
    })
)

export const projectSlugValidator = vine.compile(
  vine.string().exists(async (db, value) => {
    const row = await db.from('projects').where('slug', value).first()
    if (!row) {
      throw new ResponseError('Project not found', { status: 404 })
    }
    return row
  })
)

export const createProjectValidator = vine.compile(
  vine.object({
    licenseId: vine.string().trim().uuid().optional(),
    title: vine.string().trim().minLength(4).maxLength(100),
    type: vine.enum(['version', 'brance']),
    visibility: vine.enum(['public', 'private']),
    description: vine.string().trim().optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    licenseId: vine.string().trim().uuid().optional(),
    title: vine.string().trim().minLength(4).maxLength(100),
    type: vine.enum(['version', 'brance']),
    visibility: vine.enum(['public', 'private']),
    description: vine.string().trim().optional(),
  })
)
