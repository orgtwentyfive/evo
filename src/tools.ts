import { similarity } from 'llamaindex'
import { openai } from './config'
import { bigData } from './bigData'
import { BigDataType, ConversationType } from './types'

export async function createEmbedding(text: string) {
    const { data } = await openai.embeddings.create({
        input: text,
        model: 'text-embedding-ada-002',
    })
    return data[0].embedding
}

export function getTopEmbeddingMatch(embeddedQuestion: number[], count: number = 30) {
    let topServices: BigDataType[] = []
    let topScores: number[] = []

    for (const service of bigData) {
        let maxCore = 0
        for (const embeddings of service.embeddings) {
            const sim = similarity(embeddedQuestion, embeddings)
            if (maxCore < sim) {
                maxCore = sim
            }
        }
        if (topScores.length < count) {
            topScores.push(maxCore)
            topServices.push(service)
        }
        if (topScores.length === count) {
            const minScore = Math.min(...topScores)
            const minIndex = topScores.indexOf(minScore)
            if (maxCore > minScore) {
                topScores[minIndex] = maxCore
                topServices[minIndex] = service
            }
        }
    }
    return topServices
}

export async function pickMostRelevantDocument(topResult: ReturnType<typeof getTopEmbeddingMatch>, question: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: `
                Use docTitle to find most relevant document for question.
                Respond with the codes for most relevant documents.
                Example: [01312345, C123456, 123456]
                It's ok to not find any document.
                `.trim(),
            },
            {
                role: 'user',
                content: `
                    Data: 
                    """
                    ${JSON.stringify(topResult.map(({ title, code }) => ({ docTitle: title, code })))}
                    """
                    Question: ${question}
                `,
            },
        ],
        max_tokens: 512,
    })
    const matches = response.choices[0].message.content?.match(/[A-Z]{0,5}\d+/g)
    if (matches && matches.length) {
        return [...matches].map((code) => getDocumentByCode(code))
    }
    return []
}

export function getDocumentByCode(code: string) {
    const find = bigData.find((e) => e.code === code)
    if (find) return find
    throw new Error(`Document not found for code: ${code}`)
}

export async function answerBasedOnDocument(document: BigDataType, conversation: string | ConversationType[]) {
    const content: ConversationType[] = conversation instanceof Array ? conversation : [{ role: 'user', content: conversation }]
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {
                role: 'system',
                content: `
                Finds the answer in the provided document based on a question from the user.
                Do not answer with information outside the document.
                Use only information in the provided document.
                Respond directly to the user's question.
                And don't change the subject.
                Don't answer with information outside the document.
                If there is no answer in the document, respond with "NULL"
                Document: 
                """
                ${document.toIndexData}
                """
                `,
            },
            ...content,
        ],
    })
    const result = response.choices[0].message.content
    if (!result) throw new Error('No response from GPT-3')
    return result
}

export async function rephraseCorrectlyWithGpt4(string: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: `
                Rephrase the sentence in a more natural way.
                Respond with the rephrased sentence directly.
                Respond in the same language.
                `.trim(),
            },
            {
                role: 'user',
                content: string,
            },
        ],
    })
    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from GPT-4')
    return content
}

export async function combineAnswers(data: (BigDataType & { answer: string })[]) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: true,
        messages: [
            {
                role: 'system',
                content: `
                Combine the answers from the provided documents.
                Respond with the combined answer.
                Summarize it but keep important details.
                Respond in markdown format.
                Respond in the same language.
                Try to organize the information in a logical way.
                `.trim(),
            },
            {
                role: 'user',
                content: data.reduce((acc, cur) => {
                    const result = `
                    Document: ${cur.title}
                    Answer: ${cur.answer}
                    `.trim()
                    return acc + result + '\n==\n'
                }, ''),
            },
        ],
        temperature: 0.5,
    })
    return response
}

export async function resolveChatGptStream(stream: ReturnType<typeof combineAnswers>) {
    const result: string[] = []
    for await (const message of await stream) {
        if (message.choices[0].finish_reason === 'stop') break
        result.push(message.choices[0].delta.content!)
    }
    return result.join('\n')
}

export async function write(str: string) {
    return new Promise((resolve) => {
        process.stdout.write(str, () => {
            resolve(null)
        })
    })
}
