import Fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = Fastify({
    logger: true
})

void app.register(fastifyCookie)
void app.register(transactionsRoutes, {
    prefix: '/transactions'
})

try {
    void app.listen({ port: env.PORT })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
