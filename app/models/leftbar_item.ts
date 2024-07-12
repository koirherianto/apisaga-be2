import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import Topbar from './topbar.js'
import LeftbarSeparator from './leftbar_separator.js'

export default class LeftbarItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare topBarId: string

  @column()
  declare sidebarSeparatorId: string | null

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare order: number

  @column()
  declare isDefault: boolean

  @column()
  declare content: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(leftbarItem: LeftbarItem) {
    leftbarItem.id = crypto.randomUUID()

    leftbarItem.slug = string.slug(leftbarItem.name, { lower: true })

    const topbar = await Topbar.findOrFail(leftbarItem.topBarId)

    // leftbarItem harus unik di dalam topbar
    const existingLeftbarItem = await topbar
      .related('leftbarItems')
      .query()
      .where('slug', leftbarItem.slug)
      .first()

    if (existingLeftbarItem) {
      throw new Error('LeftbarItem name must be unique')
    }
  }

  @belongsTo(() => Topbar)
  declare topBars: BelongsTo<typeof Topbar>

  @belongsTo(() => LeftbarSeparator, {
    foreignKey: 'leftbarSeparatorId',
  })
  declare leftbarSeparator: BelongsTo<typeof LeftbarSeparator>
}