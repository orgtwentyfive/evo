import { answer } from './answer'
import { filterEmbeddings } from './filterEmbeddings'
import { data, getTop } from './getTop'

async function main() {
    const question = 'am nevoie de un extras din registru unitatilor de drept?'
    // ce documente am nevoie?
    // cat costa?
    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)
    console.log(filtered)

    const answers = await answer(filtered, question)
    console.log(answers)
}

main()
