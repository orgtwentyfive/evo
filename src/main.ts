import '@total-typescript/ts-reset'
import { map } from 'async'
import {
    answerBasedOnDocument,
    combineAnswers,
    createEmbedding,
    getDocumentByCode,
    getTopEmbeddingMatch,
    pickMostRelevantDocument,
    rephraseCorrectlyWithGpt4,
    resolveChatGptStream,
    write,
} from './tools'
import { BigDataType } from './types'

async function main() {
    const question = 'cum ma casatoresc?'
    const rephraseQuestion = await rephraseCorrectlyWithGpt4(question)
    console.log('Rephrased question:', rephraseQuestion)

    const embeddedQuestion = await createEmbedding(rephraseQuestion)
    const customFilter = getTopEmbeddingMatch(embeddedQuestion, 40)
    const filteredByAi = await pickMostRelevantDocument(customFilter, question)

    const results = await map(filteredByAi, async (document: BigDataType) => {
        const answer = await answerBasedOnDocument(document, question)
        if (answer === 'NULL') return null
        return { ...document, answer }
    })
    const filteredResult = results.filter(Boolean)
    if (filteredResult.length === 0) {
        console.log('Nu am așa informație.')
        return
    }
    let result = ''
    for await (const stream of await combineAnswers(filteredResult)) {
        const streamText = stream.choices[0].delta?.content
        if (streamText) {
            result += streamText
            await write(streamText)
        }
    }
}

main()
