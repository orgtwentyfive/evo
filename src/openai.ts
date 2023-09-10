//@ts-nocheck

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
