const OPENAI_API_KEY = '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'
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
