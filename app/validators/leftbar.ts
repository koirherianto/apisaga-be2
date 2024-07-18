import vine from '@vinejs/vine'
import ResponseError from '#exceptions/respon_error_exception'

export const createLeftbarItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(4).maxLength(100),
    order: vine.number().positive().min(1),
    content: vine.string().optional(),
    sidebarSeparatorId: vine
      .string()
      .uuid({ version: [4] })
      .exists(async (db, value) => {
        const row = await db.from('sidebar_separators').where('id', value).first()
        if (!row) {
          throw new ResponseError('Sidebar Separators not found', { status: 404 })
        }
        return row
      })
      .nullable()
      .optional(),
  })
)
