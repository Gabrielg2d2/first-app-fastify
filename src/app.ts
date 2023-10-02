import Fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

export const app = Fastify({
    logger: true
})

void app.register(fastifyCookie)
void app.register(transactionsRoutes, {
    prefix: '/transactions'
})
