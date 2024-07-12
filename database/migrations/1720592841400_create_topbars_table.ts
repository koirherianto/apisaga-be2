import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'topbars'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table
        .uuid('version_id')
        .references('id')
        .inTable('versions')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name', 100).notNullable()
      table.string('slug', 150).notNullable()
      table.boolean('is_default').defaultTo(false).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
