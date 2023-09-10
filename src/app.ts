import chalk from 'chalk'
import { answer } from './answer'
import { getData, setData } from './db'
import { filterEmbeddings } from './filterEmbeddings'
import { data, getTop } from './getTop'

async function main() {
    let conversation: any = { articleIds: [], conversations: [] }

    const question = 'cum fac cazier?'
    // // const question = 'am nevoie de un extras din registru unitatilor de drept?'
    // // ce documente am nevoie?
    // // cat costa?

    if (!conversation.articleIds!.length) {
        const top = await getTop(question, 40)
        const filtered = await filterEmbeddings(top, question)
        conversation.article_ids = filtered
        console.log(chalk.red('Step 1'))
        console.log(
            `Am gasit informatie in urmatoarele articole\n${filtered.map((e) => `https://servicii.gov.md/ro/service/${e}`).join('\n')}`,
        )
    }

    conversation.conversations = [
        {
            content: `${question}`,
            role: 'user',
        },
    ]
    console.log(chalk.red('Step 2'))
    console.log(`Caut prin articole...`)
    const streams = await answer(conversation.articleIds!, conversation.conversations!)
    let answers = ''
    for await (const stream of streams) {
        answers += stream.choices[0].delta.content
        // console.clear()
    }
    console.log(chalk.red('Step 3'))

    console.log(answers)

    // console.log(answers)
}

main()
