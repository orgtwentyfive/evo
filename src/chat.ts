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
import { BigDataType, ConversationType } from './types'
import inquirer from 'inquirer'

let filteredByAi: BigDataType[] = []
const conversation: ConversationType[] = []

async function main() {
    console.log()
    const { question } = await inquirer.prompt<{ question: string }>({
        type: 'input',
        name: 'question',
        message: 'Question?',
    })
    const rephraseQuestion = await rephraseCorrectlyWithGpt4(question)
    conversation.push({
        role: 'user',
        content: rephraseQuestion,
    })
    if (filteredByAi.length === 0) {
        const embeddedQuestion = await createEmbedding(rephraseQuestion)
        const customFilter = getTopEmbeddingMatch(embeddedQuestion, 40)
        filteredByAi = await pickMostRelevantDocument(customFilter, rephraseQuestion)
    }

    const results = await map(filteredByAi, async (document: BigDataType) => {
        const answers = await answersBasedOnDocument(document, conversation)
        return {
            ...document,
            answers,
        }
    })
    const filteredResult = results.filter(Boolean)
    if (filteredResult.length === 0) {
        console.log('Nu am așa informație.')
        return
    }
    let result = ''
    for await (const stream of await combineAnswers(filteredResult, rephraseQuestion)) {
        const streamText = stream.choices[0].delta?.content
        if (streamText) {
            result += streamText
            await write(streamText)
        }
    }
    conversation.push({
        role: 'assistant',
        content: result,
    })
    main()
}

main()
