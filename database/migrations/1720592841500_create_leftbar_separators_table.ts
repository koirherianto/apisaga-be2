import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leftbar_separators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('topbar_id').notNullable().references('id').inTable('topbars').onDelete('CASCADE')
      table.string('name', 100).notNullable()
      table.string('slug', 150).notNullable()
      table.tinyint('order').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
