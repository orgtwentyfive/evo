const OPENAI_API_KEY = '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'
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
