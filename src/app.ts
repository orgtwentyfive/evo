import { answer } from './answer'
import { getData, setData } from './db'
import { filterEmbeddings } from './filterEmbeddings'
import { data, getTop } from './getTop'

async function main() {
    const converstationId = Math.random().toString()

    let conversation = await getData(converstationId)

    const question = 'cum export animale?'
    // // const question = 'am nevoie de un extras din registru unitatilor de drept?'
    // // ce documente am nevoie?
    // // cat costa?
    if (!conversation) {
        conversation = { articleIds: [], conversations: [] }
    }

    if (!conversation.articleIds!.length) {
        const top = await getTop(question, 40)
        const filtered = await filterEmbeddings(top, question)
        await setData(converstationId, {
            articleIds: filtered,
            conversations: conversation.conversations,
        })
        console.log(
            `Am gasit informatie in urmatoarele articole\n${filtered.map((e) => `https://servicii.gov.md/ro/service/${e}`).join('\n')}`,
        )
    }

    await setData(converstationId, {
        conversations: [...conversation.conversations!, { content: `${question}`, role: 'user' }],
    })

    conversation = await getData(converstationId)

    console.log(conversation)
    console.log(`Caut prin articole...`)
    const streams = await answer(conversation.articleIds!, conversation.conversations!)
    let answers = ''
    for await (const stream of streams) {
        answers += stream.choices[0].delta.content
        console.clear()
        console.log(answers)
    }

    await setData(converstationId, {
        conversations: [...conversation.conversations!, { content: answers, role: 'assistant' }],
    })
    // console.log(answers)
}

main()
