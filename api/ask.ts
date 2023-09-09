import type { VercelRequest, VercelResponse } from '@vercel/node'
import { filterEmbeddings } from '../src/filterEmbeddings'
import { getTop } from '../src/getTop'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (!request.url) return response.status(400)
    const question = request.body.question
    const conversation_id = request.body.conversation_id
    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)

    return response.status(200).json(filtered)
}
