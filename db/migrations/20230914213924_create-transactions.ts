import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()
        table.string('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions')
}
