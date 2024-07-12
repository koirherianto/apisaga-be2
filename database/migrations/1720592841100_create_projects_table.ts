import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      // table.uuid('license_id').references('id').inTable('licenses').onDelete('CASCADE').nullable()
      table.string('title', 200).notNullable()
      table.string('slug', 200).unique().notNullable()
      table.enum('type', ['version', 'brance']).notNullable()
      table.enum('visibility', ['public', 'private']).notNullable()
      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
