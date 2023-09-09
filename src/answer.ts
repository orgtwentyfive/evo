import { data } from './getTop'
import { openai } from './openai'
import { map } from 'async'
import { encode } from 'gpt-3-encoder'

export async function answer(articles: string[], question: string) {
    const articleContents = articles
        .map((articleCode) => {
            const entry = data.find((dataEntry) => dataEntry['code'] == articleCode)
            if (!entry) return undefined
            return { title: entry.title, content: entry.toIndexData }
        })
        .filter((e) => e !== undefined)

    const responses: { title: string; data: string }[] = await map(articleContents, async (content) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'system',
                    content: `You are a bot that finds the answer in the provided article based on a question from the user.\nYour article is: ${
                        content!.content
                    }`,
                },
                {
                    role: 'user',
                    content: question,
                },
            ],
        })
        console.log(`Am analizat articolul ${content!.title}`)
        return { title: content!.title, data: response.choices[0].message.content! }
    })

    const joinedResponses = responses.map((response) => {
        return `Article Title: ${response.title}\nArticle Content: ${response.data}`
    })
    console.log(`Generez un raspuns final...`)

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: true,
        messages: [
            {
                role: 'system',
                content: `You are a bot that return a single answer based on multiple articles provided by the user. Summarize it but keep important details. Answer only in romanian and with actual information\n Do not assume, use only existing information.\n If information is not present, say "No such information.".`,
            },
            {
                role: 'user',
                content: joinedResponses.join('\n'),
            },
        ],
    })
    let string = ''
    for await (let stream of response) {
        string += stream.choices[0].delta.content
        console.clear()
        console.log(string)
    }
}
