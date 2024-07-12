import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Topbar from './topbar.js'
import string from '@adonisjs/core/helpers/string'

export default class Version extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare isDefault: boolean

  @column()
  declare versionStatus: string | null

  @column()
  declare visibility: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(version: Version) {
    version.id = crypto.randomUUID()
    version.slug = string.slug(version.name, { lower: true })
  }

  @hasMany(() => Topbar)
  declare topbars: HasMany<typeof Topbar>

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
