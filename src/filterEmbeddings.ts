import { openai } from './openai'

export async function filterEmbeddings(topString: string, question: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content:
                    'You are a bot that answers with 4 codes of articles based on a question.\nThe articles are provided by the user.\nAnswer with codes only.\nIf there are similar articles, provide both.',
            },
            {
                role: 'user',
                content: `This is your database of articles:\n"""\n${topString}"""\nQuestion: ${question}?`,
            },
        ],
        temperature: 1.01,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })

    const filtered = response.choices[0].message.content
    const matches = filtered?.match(/\d+/g)

    if (!matches || !matches.length) {
        return []
    }

    return matches
}
