import { answer } from './answer'
import { filterEmbeddings } from './filterEmbeddings'
import { data, getTop } from './getTop'

async function main() {
    const question = 'care sunt toate variantele correcte pentru tarife de casatorie?'
    // const question = 'am nevoie de un extras din registru unitatilor de drept?'
    // ce documente am nevoie?
    // cat costa?
    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)
    console.log(`Am gasit informatie in urmatoarele articole\n${filtered.map((e) => `https://servicii.gov.md/ro/service/${e}`).join('\n')}`)
    console.log(`Caut prin articole...`)
    const answers = await answer(filtered, question)
    console.log(answers)
}

main()
