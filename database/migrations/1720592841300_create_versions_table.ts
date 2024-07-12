import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'versions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table
        .uuid('project_id')
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name', 100).notNullable()
      table.boolean('is_default').defaultTo(false).notNullable()
      table.enum('visibility', ['public', 'private', 'archives']).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
