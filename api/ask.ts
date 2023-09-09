import type { VercelRequest, VercelResponse } from '@vercel/node'
import { filterEmbeddings } from '../src/filterEmbeddings'
import { getTop } from '../src/getTop'
import express from 'express'
import cors from 'cors'
import { getData } from '../src/db'
import { answer } from '../src/answer'
import json from '../data.json'

const bigData = json as any[]

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.get('*', async (req, res) => {
    res.send('spinner')
})

app.post('/ask', async (req, res) => {
    const { conversations, data } = req.body
    if (data) {
        const article_ids = data.map((e: any) => e.code)
        res.write(`${JSON.stringify({ data, conversations })}\n`)

        const streams = await answer(article_ids, [
            {
                role: 'user',
                content: `${conversations.at(-1).content}`,
            },
        ])
        for await (const stream of streams) {
            const data = stream.choices[0].delta.content
            if (data) {
                res.write(data)
            }
        }
        res.end()
        return
    }
    let question = conversations.at(-1).content
    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)

    const resultData = filtered.map((e: string) => {
        const entry = bigData.find((dataEntry) => dataEntry['code'] == e)
        const source = entry.type === 'event' ? `https://servicii.gov.md/ro/event/${entry.code}` : `https://servicii.gov.md/ro/service/${e}`
        return { code: e, source }
    })

    res.write(`${JSON.stringify({ data: resultData, conversations })}\n`)
    const conversation = conversations.pop()
    const streams = await answer(filtered, [...conversations, { role: 'user', content: `${question}` }])
    for await (const stream of streams) {
        const data = stream.choices[0].delta.content
        if (data) {
            res.write(data)
        }
    }
    res.end()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
