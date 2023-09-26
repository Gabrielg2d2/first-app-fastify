import { type FastifyReply } from 'fastify'
import { type FastifyRequest } from 'fastify/types/request'

export async function checkSessionIdExists(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
        return await reply.status(401).send({
            error: 'Unauthorized'
        })
    }
}
