const OPENAI_API_KEY = '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'
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
