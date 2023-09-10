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
    const sentenceSplitter = new SentenceSplitter({
        chunkSize: 5000,
        chunkOverlap: 1000,
    })
    for (let service of data) {
        if (service.chunk) continue
        const { toIndexData } = service
        const emmbedings = await Promise.all(
            sentenceSplitter.splitText(toIndexData).map(async (text) => {
                const { data } = await openai.embeddings.create({
                    input: text,
                    model: 'text-embedding-ada-002',
                })
                return data[0].embedding
            }),
        )
        service.emmbedings = emmbedings
        if (i % 10 === 0) fs.writeFileSync('data.json', JSON.stringify(data))
        console.log(i++)
    }
    // // for (let i = 0; i < toProcess; i++) {}
    // const document = new Document({ text: json[0].toIndexData })
    // // const document2 = new Document({ text: json[1].toIndexData })
    // // Split text and create embeddings. Store them in a VectorStoreIndex
    // const index = await VectorStoreIndex.fromDocuments([document])
    // // console.log(index.docStore)
    // console.log(index)
    // const queryEngine = index.asQueryEngine()
    // const response = await queryEngine.query('Actele necesare pentru somaj?')
    // console.log(response)
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
