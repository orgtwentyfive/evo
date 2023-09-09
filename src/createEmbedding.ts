import { openai } from './openai'

export async function createEmbedding(text: string) {
    const { data } = await openai.embeddings.create({
        input: text,
        model: 'text-embedding-ada-002',
    })
    return data[0].embedding
}
