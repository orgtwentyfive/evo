import { ChatCompletionMessageParam } from 'openai/resources/chat'

export interface BigDataType {
    title: string
    code: string
    toIndexData: string
    embeddings: number[][]
}

export type ConversationType = ChatCompletionMessageParam
