import axios from 'axios'
import fs from 'fs'
import TurndownService from 'turndown'

const turndownService = new TurndownService()

async function main() {
    const result: any[] = []
    const { data: categories } = await axios('https://servicii.gov.md/rsspa-api/catalog/categories')
    let i = 0
    for (const category of categories) {
        const categoryId = category.id
        const categoryName = category.name.ro
        const categoryDescription = category.description.ro && turndownService.turndown(category.description.ro)
        const { data: services } = await axios(`https://servicii.gov.md/rsspa-api/catalog/categories/${categoryId}`)
        for (const service of services.publicServices) {
            const code = service.code
            const title = service.title.ro
            const description = service.description.ro && turndownService.turndown(service.description.ro)
            const eService = service.eService
            const { data } = await axios(`https://servicii.gov.md/rsspa-api/public-service/code/${code}`)
            const toIndexData = processServiceForIndex(data)
            fs.writeFileSync(`test/${code}.txt`, toIndexData)
            result.push({
                code,
                title,
                description,
                eService,
                categoryName,
                categoryDescription,
                categoryId,
                toIndexData,
            })
            console.log(i++)
        }
    }

    const {
        data: { events },
    } = await axios('https://servicii.gov.md/rsspa-api/catalog/events')
    for (const event of events) {
        const { data } = await axios(`https://servicii.gov.md/rsspa-api/event/code/${event.code}`)
        const title = event.title.ro
        const description = event.description.ro && turndownService.turndown(event.description.ro)
        const steps = data.steps
        let textSteps = ''
        for (const step of steps) {
            parseSteps(step)
        }
        function parseSteps(node: any) {
            // title
            textSteps += `${node.code} ${node.title.ro}\n`
            // description
            textSteps += `${turndownService.turndown(node.description.ro || '')}\n`
            // children
            for (const child of node.children) {
                parseSteps(child)
            }
        }
        textSteps = textSteps.replace(/\*/g, '').replace(/\\\./g, '.').replace(/  /g, '').replace(/\n\n/g, '\n').trim()
        fs.writeFileSync(`test/${event.code}.txt`, textSteps)
        result.push({
            type: 'event',
            code: event.code,
            title,
            description,
            toIndexData: textSteps,
        })
        console.log(i++)
    }
    const noDuplicate: any[] = []
    for (const item of result) {
        const isDuplicate = noDuplicate.find((b) => item.code === b.code)
        if (!isDuplicate) {
            noDuplicate.push(item)
        }
    }

    fs.writeFileSync('data.json', JSON.stringify(result, null, 4))
}

main().then(() => console.log('Done!'))

function processServiceForIndex(data: any) {
    let textData = ''
    textData += `${data.title.ro}\n`
    textData += `${turndownService.turndown(data.objective.ro || '')}\n`

    // steps
    if (data.steps.length) {
        textData += `# Descrierea procesului de obținere a serviciului în cauză\n`
        for (const step of data.steps.sort((a, b) => a.order - b.order)) {
            textData += `${turndownService.turndown(step.title.ro || '')}\n`
            textData += `${turndownService.turndown(step.description.ro || '')}\n`
        }
    }

    //tarifele
    if (data.costs.length) {
        textData += `# Tarifele și termenii prestării serviciului\n`
        for (const cost of data.costs.reverse()) {
            let costText = ''
            let timp = ''
            if (cost.durationValue) {
                if (cost.durationUnit === 'WorkDay') {
                    if (cost.durationValue === 1) {
                        timp = 'zi de lucru'
                    } else {
                        timp = 'zile de lucru'
                    }
                } else if (cost.durationUnit === 'CalendarDay') {
                    timp = 'zile calendaristice'
                } else if (cost.durationUnit === 'Hour') {
                    timp = 'ore'
                } else if (cost.durationUnit === 'Minute') {
                    timp = 'minute'
                }
            }
            if (timp) {
                costText = `Timp ${cost.durationValue} ${timp}. `
            }
            if (cost.price != '0') {
                costText += `Tarif achitare ${cost.price} ${cost.currency}. `
            } else {
                costText += `Tarif achitare Gratuit. `
            }
            if (cost.commentary) {
                costText += `${turndownService.turndown(cost.commentary)}.`
            }
            textData += `${costText}\n`
        }
    }
    //documentele actele necesare
    if (data.documents.some((d) => d.type === 'Required')) {
        textData += `# Documentele actele necesare\n`
        for (const document of data.documents) {
            let documentText = ''
            if (document.type !== 'Required') continue
            documentText += `${turndownService.turndown(document.title.ro || '')}. `
            if (document.details) {
                documentText += `${turndownService.turndown(document.details || '')}`
            }

            textData += `${documentText}\n`
        }
    }
    //lista actelor normative
    if (data.documents.some((d) => d.type === 'Legal')) {
        textData += `# Lista actelor normative\n`
        for (const document of data.documents) {
            if (document.type !== 'Legal') continue
            textData += `${document.title.ro}\n`
        }
    }
    //Procesul de depunere a petițiilor / plângerilor
    if (data.complaintsProcess?.ro) {
        textData += `# Procesul de depunere a petițiilor / plângerilor\n`
        textData += `${turndownService.turndown(data.complaintsProcess.ro)}\n`
    }

    // Sancțiuni și penalități
    if (data.sanctionsAndPenalties?.ro) {
        textData += `# Sancțiuni și penalități\n`
        textData += `${turndownService.turndown(data.sanctionsAndPenalties.ro)}`
    }
    // clear data
    return textData.replace(/\*/g, '').replace(/\\\./g, '.').replace(/  /g, '').replace(/\n\n/g, '\n').trim()
}

function processForGpt(data: any) {
    let textData = `
        Sursa: https://servicii.gov.md/ro/service/${data.code}
        Titlu: ${data.title.ro}
        Descriere: ${turndownService.turndown(data.objective.ro || '')}\n
    `
    // steps
    if (data.steps.length) {
        textData += `# Descrierea procesului de obținere a serviciului în cauză\n`
        for (const step of data.steps.sort((a, b) => a.order - b.order)) {
            textData += `Pas: ${turndownService.turndown(step.title.ro || '')}\n`
            textData += `Descriere: ${turndownService.turndown(step.description.ro || '')}\n`
        }
    }

    //tarifele
    if (data.costs.length) {
        textData += `# Tarifele și termenii prestării serviciului\n`
        for (const cost of data.costs.reverse()) {
            let costText = ''
            let timp = ''
            if (cost.durationValue) {
                if (cost.durationUnit === 'WorkDay') {
                    if (cost.durationValue === 1) {
                        timp = 'zi de lucru'
                    } else {
                        timp = 'zile de lucru'
                    }
                } else if (cost.durationUnit === 'CalendarDay') {
                    timp = 'zile calendaristice'
                } else if (cost.durationUnit === 'Hour') {
                    timp = 'ore'
                } else if (cost.durationUnit === 'Minute') {
                    timp = 'minute'
                }
            }
            if (timp) {
                costText = `Timp ${cost.durationValue} ${timp}. `
            }
            if (cost.price != '0') {
                costText += `Tarif achitare ${cost.price} ${cost.currency}. `
            } else {
                costText += `Tarif achitare Gratuit. `
            }
            if (cost.commentary) {
                costText += `${turndownService.turndown(cost.commentary)}.`
            }
            textData += `${costText}\n`
        }
    }
    //documentele actele necesare
    if (data.documents.some((d) => d.type === 'Required')) {
        textData += `# Documentele actele necesare\n`
        for (const document of data.documents) {
            let documentText = ''
            if (document.type !== 'Required') continue
            documentText += `Doc: ${turndownService.turndown(document.title.ro || '')}\n`
            if (document.details) {
                documentText += `Detalii: ${turndownService.turndown(document.details || '')}`
            }

            textData += `${documentText}\n`
        }
    }
    //lista actelor normative
    if (data.documents.some((d) => d.type === 'Legal')) {
        textData += `# Lista actelor normative\n`
        for (const document of data.documents) {
            if (document.type !== 'Legal') continue
            textData += `${document.title.ro}\n`
        }
    }
    //Procesul de depunere a petițiilor / plângerilor
    if (data.complaintsProcess?.ro) {
        textData += `# Procesul de depunere a petițiilor / plângerilor\n`
        textData += `${turndownService.turndown(data.complaintsProcess.ro)}\n`
    }

    // Sancțiuni și penalități
    if (data.sanctionsAndPenalties?.ro) {
        textData += `# Sancțiuni și penalități\n`
        textData += `${turndownService.turndown(data.sanctionsAndPenalties.ro)}\n`
    }
    // clear data
    return textData.replace(/\*/g, '').replace(/\\\./g, '.').replace(/  /g, '').replace(/\n\n/g, '\n').trim()
}
