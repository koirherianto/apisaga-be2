import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Version from './version.js'
import string from '@adonisjs/core/helpers/string'
import LeftbarItem from './leftbar_item.js'
import LeftbarSeparator from './leftbar_separator.js'

export default class Topbar extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare versionId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Version)
  declare version: BelongsTo<typeof Version>

  @hasMany(() => LeftbarItem)
  declare leftbarItems: HasMany<typeof LeftbarItem>

  @hasMany(() => LeftbarSeparator)
  declare leftbarSeparators: HasMany<typeof LeftbarSeparator>

  @beforeCreate()
  static async assignUuid(topbar: Topbar) {
    topbar.id = crypto.randomUUID()
    topbar.slug = string.slug(topbar.name, { lower: true })
  }
}
