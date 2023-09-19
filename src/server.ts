import Fastify from 'fastify'
import { knex } from './database'
import crypto from 'crypto'
import { env } from './env'

const app = Fastify({
    logger: true
})

app.get('/hello', async function handler(request, reply) {
    const transactions = await knex('transactions')
        .insert({
            id: crypto.randomUUID(),
            title: 'Transaction Test 1',
            amount: 10000
        })
        .returning('*')

    return transactions
})

try {
    void app.listen({ port: env.PORT })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
