import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (!request.url) return response.status(400)
    const question = request.body.question
    const conversation_id = request.body.conversation_id

    return response.status(200).json({ question, conversation_id })
}
