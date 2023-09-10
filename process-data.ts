const OPENAI_API_KEY = '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'
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'
import json from './data.json'
import { encode } from 'gpt-3-encoder'
import fs from 'fs'
import axios from 'axios'
import { SentenceSplitter, similarity } from 'llamaindex'

let data = json as any[]

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
let i = 0
async function main() {
    // let chunkSum = 0
    // let chunkCount = 0
    // let biggerThanOne = 0
    // for (let service of data) {
    //     const { toIndexData, chunks } = service
    //     chunkSum += chunks.length
    //     chunkCount++
    //     if (chunks.length > 1) {
    //         biggerThanOne++
    //         console.log(`Service ${service.code} has ${chunks.length} chunks`)
    //     }
    // }
    // console.log(chunkSum / chunkCount)
    // console.log('Bigger than one', biggerThanOne)
    const sentenceSplitter = new SentenceSplitter({
        chunkSize: 10000,
        chunkOverlap: 1000,
    })
    for (let service of data) {
        const { toIndexData } = service
        const embeddings = await Promise.all(sentenceSplitter.splitText(toIndexData).map(createEmbedding))
        service.embeddings = embeddings
        if (i % 100 === 0) fs.writeFileSync('data.json', JSON.stringify(data))
        console.log(i++)
    }
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
}

main().then(() => console.log('Done!'))

function estimatePrice(text: string, pricePerToken = 0.0001 / 1000) {
    const encoded = encode(text)

    const price = encoded.length * pricePerToken

    return price
}

async function createEmbedding(text: string) {
    const { data } = await openai.embeddings.create({
        input: text,
        model: 'text-embedding-ada-002',
    })
    return data[0].embedding
}
