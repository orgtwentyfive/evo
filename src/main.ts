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
} from './tools'

async function main() {
    const question = 'Cum pot sa zbor pe luna pasaport?'
    const rephraseQuestion = await rephraseCorrectlyWithGpt4(question)
    console.log('Rephrased question:', rephraseQuestion)

    const embeddedQuestion = await createEmbedding(rephraseQuestion)
    const customFilter = getTopEmbeddingMatch(embeddedQuestion, 40)
    const filteredByAi = await pickMostRelevantDocument(customFilter, question)

    const results = await map(filteredByAi, async (document) => {
        const answer = await answerBasedOnDocument(document, question)
        if (answer === 'NULL') return null
        return { ...document, answer }
    })
    if (results.length === 0) {
        console.log('Nu am așa informație.')
        return
    }
    const filteredResult = results.filter((e) => e !== null)
    const result = await resolveChatGptStream(combineAnswers(filteredResult))
    console.log('Result:', result)
}

main()
