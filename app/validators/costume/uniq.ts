import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
  except?: string
}

/**
 * Implementation
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }
  let row
  if (options.except) {
    row = await db
      .from(options.table)
      .select(options.column)
      .where(options.column, value)
      .whereNot('id', options.except)
      .first()
  } else {
    row = await db.from(options.table).select(options.column).where(options.column, value).first()
  }

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

export const uniqueCustom = vine.createRule(unique)
