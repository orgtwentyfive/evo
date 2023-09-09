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
    for (let item of data) {
        item.embeddings = item.embedding
        delete item.embedding
        delete item.toIndexDataEn
    }
    fs.writeFileSync('data.json', JSON.stringify(data, null, 4))

    // await tranlate()
    // const question = 'cum ma casatoresc legal in republica moldova?'
    // const questionEmbedding = await createEmbedding(question)
    // let num = 20
    // let top3Services: any[] = []
    // let top3Scores: number[] = []
    // console.time('search')
    // for (const service of data) {
    //     if (!service.emmbedings) continue
    //     for (const emmbedings of service.emmbedings) {
    //         const sim = similarity(questionEmbedding, emmbedings)
    //         if (top3Scores.length < num) {
    //             top3Scores.push(sim)
    //             top3Services.push(service)
    //         }
    //         if (top3Scores.length === num) {
    //             const minScore = Math.min(...top3Scores)
    //             const minIndex = top3Scores.indexOf(minScore)
    //             if (sim > minScore) {
    //                 top3Scores[minIndex] = sim
    //                 top3Services[minIndex] = service
    //             }
    //         }
    //     }
    // }
    // console.timeEnd('search')
    // for (let i = 0; i < top3Services.length; i++) {
    //     console.log('===========================')
    //     console.log(`${top3Services[i].title} - ${top3Scores[i]}; code: ${top3Services[i].code}`)
    // }
    // for (let emmbedings of service.emmbedings) {
    //     const sim = similarity(questionEmbedding, emmbedings)
    //     console.log(sim)
    // }
    // const sentenceSplitter = new SentenceSplitter({
    //     chunkSize: 5000,
    //     chunkOverlap: 1000,
    // })
    // for (let service of data) {
    //     if (service.emmbedings) continue
    //     const { toIndexData } = service
    //     const emmbedings = await Promise.all(
    //         sentenceSplitter.splitText(toIndexData).map(async (text) => {
    //             const { data } = await openai.embeddings.create({
    //                 input: text,
    //                 model: 'text-embedding-ada-002',
    //             })
    //             return data[0].embedding
    //         }),
    //     )
    //     service.emmbedings = emmbedings
    //     if (i % 10 === 0) fs.writeFileSync('data.json', JSON.stringify(data))
    //     console.log(i++)
    // }
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

async function tranlate() {
    let i = 0
    for (const item of data) {
        if (item.toIndexDataEn) continue
        const { data: tranlate } = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            {
                text: [item.toIndexData],
                target_lang: 'EN',
            },
            {
                headers: {
                    Authorization: 'DeepL-Auth-Key 7817f4a0-fb9e-47b8-ae44-848755da4ac3:fx',
                },
            },
        )
        item.toIndexDataEn = tranlate.translations[0].text
        fs.writeFileSync('data.json', JSON.stringify(data, null, 4))
        console.log(i++)
    }
}

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
