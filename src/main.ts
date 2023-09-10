import '@total-typescript/ts-reset'
import { map } from 'async'
import {
    answersBasedOnDocument,
    combineAnswers,
    createEmbedding,
    getTopEmbeddingMatch,
    pickMostRelevantDocument,
    rephraseCorrectlyWithGpt4,
    write,
} from './tools'
import { BigDataType } from './types'

async function main() {
    const question = 'Cat costa cazier juridic?'
    const rephraseQuestion = await rephraseCorrectlyWithGpt4(question)
    console.log('Rephrased question:', rephraseQuestion)

    const embeddedQuestion = await createEmbedding(rephraseQuestion)
    const customFilter = getTopEmbeddingMatch(embeddedQuestion, 40)
    const filteredByAi = await pickMostRelevantDocument(customFilter, rephraseQuestion)

    const results = await map(filteredByAi, async (document: BigDataType) => {
        console.log('Searching for answers in:', document.title)
        const answers = await answersBasedOnDocument(document, rephraseQuestion)
        return {
            ...document,
            answers,
        }
    })
    console.log('Results:', results)
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
    console.clear()
    console.log(result)
}

main()
