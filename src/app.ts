import { filterEmbeddings } from './filterEmbeddings'
import { data, getTop } from './getTop'

async function main() {
    const question = 'cat ma costa cazierul?'
    const top = await getTop(question, 40)
    const filtered = await filterEmbeddings(top, question)

    console.log(filtered)
}

main()
