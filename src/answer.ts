import { data } from './getTop'
import { openai } from './openai'

export async function answer(articles: string[], question: string) {
    const articleContents = articles.map((articleCode) => {
        return data.find((dataEntry) => dataEntry['code'] == articleCode).toIndexData
    })

    const responses: string[] = []
    for (const content of articleContents) {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'system',
                    content: `You are a bot that finds the answer in the provided article based on a question from the user.\n Your article is: ${content}`,
                },
                {
                    role: 'user',
                    content: question,
                },
            ],
        })

        responses.push(response.choices[0].message.content!)
    }

    return responses
}
