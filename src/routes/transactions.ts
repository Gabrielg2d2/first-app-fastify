import { type FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
    app.get(
        '/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const sessionId = request.cookies.sessionId

            if (!sessionId) {
                return await reply.status(401).send({
                    error: 'Unauthorized'
                })
            }

            const transactions = await knex('transactions').select('*')
            return {
                transactions
            }
        }
    )

    app.get(
        '/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const getTransactionParamsSchema = z.object({
                id: z.string().uuid()
            })

            const { id } = getTransactionParamsSchema.parse(request.params)

            const transaction = await knex('transactions')
                .where('id', id)
                .first()

            if (!transaction) {
                return await reply.code(404).send()
            }

            return {
                transaction
            }
        }
    )

    app.get(
        '/summary',
        {
            preHandler: [checkSessionIdExists]
        },
        async () => {
            const transactions = await knex('transactions').select('*')

            const summary = transactions.reduce(
                (acc, transaction) => {
                    if (transaction.amount > 0) {
                        acc.income += transaction.amount
                    } else {
                        acc.outcome += transaction.amount
                    }

                    acc.total += transaction.amount

                    return acc
                },
                {
                    income: 0,
                    outcome: 0,
                    total: 0
                }
            )

            return {
                summary
            }
        }
    )

    app.post('/', async (request, reply) => {
        const createdTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.string()
        })

        const { title, amount, type } = createdTransactionSchema.parse(
            request.body
        )

        let sessionId = request.cookies.sessionId
        const sevenDaysInMilliseconds = 1000 * 60 * 60 * 24 * 7

        if (!sessionId) {
            sessionId = crypto.randomUUID()
            void reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: sevenDaysInMilliseconds
            })
        }

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        })

        return await reply.code(201).send()
    })
}
