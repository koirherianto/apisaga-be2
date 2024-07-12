import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Version from '#models/version'
import User from './user.js'
import string from '@adonisjs/core/helpers/string'
export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare licenseId: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare type: string

  @column()
  declare visibility: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async assignUuid(project: Project) {
    project.id = crypto.randomUUID()

    const baseSlug = string.slug(project.title, { lower: true })
    let slug = baseSlug
    let count = 1

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existingProject = await Project.query().where('slug', slug).first()
      if (!existingProject || existingProject.id === project.id) {
        break
      }
      slug = `${baseSlug}-${count}`
      count++
    }
    project.slug = slug
  }

  @hasMany(() => Version)
  declare versions: HasMany<typeof Version>

  @manyToMany(() => User, {
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>
}
