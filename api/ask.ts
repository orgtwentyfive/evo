import type { VercelRequest, VercelResponse } from '@vercel/node'
import { filterEmbeddings } from '../src/filterEmbeddings'
import { getTop } from '../src/getTop'
import express from 'express'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.post('/ask', async (request, response) => {
    if (!request.url) return response.status(400)
    const question = request.body.question
    const conversation_id = request.body.conversation_id

    if (!request.body) {
        return response.status(400).json({ message: 'No body provided' })
    }

    if (!question) {
        return response.status(400).json({ message: 'No question provided' })
    }

    if (!conversation_id) {
        return response.status(400).json({ message: 'No conversation id provided' })
    }

    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)

    return response.status(200).json(filtered)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
