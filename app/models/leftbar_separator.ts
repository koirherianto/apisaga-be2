import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import Topbar from './topbar.js'
import LeftbarItem from './leftbar_item.js'

export default class LeftbarSeparator extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare topBarId: string

  @column()
  declare name: string

  @column()
  declare slug: String

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(leftbarSeparator: LeftbarSeparator) {
    leftbarSeparator.id = crypto.randomUUID()

    if (leftbarSeparator.name) {
      const baseSlug = string.slug(leftbarSeparator.name, { lower: true })
      let slug = baseSlug
      let count = 1

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existingSeparator = await LeftbarSeparator.query().where('slug', slug).first()
        if (!existingSeparator || existingSeparator.id === leftbarSeparator.id) {
          break
        }
        slug = `${baseSlug}-${count}`
        count++
      }

      leftbarSeparator.slug = slug
    }
  }

  @belongsTo(() => Topbar)
  declare topbars: BelongsTo<typeof Topbar>

  @hasMany(() => LeftbarItem)
  declare leftbarItems: HasMany<typeof LeftbarItem>
}
