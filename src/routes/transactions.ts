import { type FastifyInstance } from 'fastify'
import { knexConnect } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
    app.get('/', async () => {
        const transactions = await knexConnect('transactions')
            .where('amount', '>', 1)
            .select('*')

        return transactions
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
