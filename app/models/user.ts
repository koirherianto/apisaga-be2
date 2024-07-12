import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = crypto.randomUUID()
  }

  // relasi many to many ke project
  @manyToMany(() => Project, {
    // localKey: 'id', // nama kolom primary key di table ini
    // pivotForeignKey: 'user_id', // nama kolom foreign key di pivot table
    // relatedKey: 'id', // nama kolom primary key di table target
    // pivotRelatedForeignKey: 'project_id', // nama kolom foreign key di pivot table
    pivotTable: 'project_user', // nama pivot table
    // pivotColumns: [], // jika tabel pivot memiliki kolom tambahan
    pivotTimestamps: {
      // jika tabel pivot memiliki kolom timestamps
      createdAt: 'created_at',
      updatedAt: true,
    },
  })
  declare projects: ManyToMany<typeof Project>
}
