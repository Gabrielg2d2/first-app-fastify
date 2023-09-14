// Import the framework and instantiate it
import Fastify from 'fastify'
import { knex } from './database'

const app = Fastify({
    logger: true
})

app.get('/hello', async function handler(request, reply) {
    const tables = await knex('sqlite_schema').select('*')
    return tables
})

try {
    void app.listen({ port: 3333 })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
