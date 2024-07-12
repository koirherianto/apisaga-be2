import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leftbar_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('topbar_id').references('id').inTable('topbars').onDelete('CASCADE').notNullable()
      table
        .uuid('leftbar_separator_id')
        .references('id')
        .inTable('leftbar_separators')
        .onDelete('CASCADE')
        .nullable()
      table.string('name', 100).notNullable()
      table.string('slug', 150).notNullable()
      table.tinyint('order').notNullable()
      table.text('content').nullable()
      table.boolean('is_default').defaultTo(false).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
