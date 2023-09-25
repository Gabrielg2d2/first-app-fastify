import { type FastifyInstance } from 'fastify'
import { knexConnect } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
    app.get('/', async () => {
        const transactions = await knexConnect('transactions').select('*')
        return {
            transactions
        }
    })

    app.get('/:id', async (request, reply) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const transaction = await knexConnect('transactions')
            .where('id', id)
            .first()

        if (!transaction) {
            return await reply.code(404).send()
        }

        return {
            transaction
        }
    })

    app.post('/', async (request, reply) => {
        const createdTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.string()
        })

        const { title, amount, type } = createdTransactionSchema.parse(
            request.body
        )

        await knexConnect('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1
        })

        return await reply.code(201).send()
    })
}
