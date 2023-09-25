import Fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = Fastify({
    logger: true
})

void app.register(transactionsRoutes, {
    prefix: '/transactions'
})

try {
    void app.listen({ port: env.PORT })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
