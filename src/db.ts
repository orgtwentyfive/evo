import admin from 'firebase-admin'

export const firebase = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'bots-1337',
        clientEmail: 'firebase-adminsdk-6jcxc@bots-1337.iam.gserviceaccount.com',
        privateKey:
            '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDbotkl/cZzjURT\nhDPgSQPcARrZqCkWO8zYZQiCUrvLYLi+OYrUQE+6SMMt9MNANnZ+hAbxJWM/i5OE\nnWX7Rl6k41SZwJkgwpoVCex2ZXGKNCVyVIH47V7KxmNAkpSxPEz6tfuQp4FMiSf4\nHJrbWafW0mciX7HUF9pYZApKLOe+EiY5UcOZsdTPieldm03dLDNu0waKab68RBsK\n7MzK/7LVwtnoNnrzX9rugtgTNQbO3BVQyCybaY6TM1JRR6TleXl7r7MihqkhKg5+\n6xZZ7zYWt9+NrOGOXRAJzhzLLzCyJE6er/73bD8Tu3ZQK38A6KqdwPg+UNRCjmbJ\n6KCh6229AgMBAAECggEADgdWy2BsPpE1XghBr/+56WGAr4pYJX1oViIN6xURvanN\n4wiV33zEGufu346UshNIekhAkUKMFlD5+Sx8iRIzlWCX1MJChZ8obFOX8PAF0ogG\nJElVi+rNdTI6wLMcID3zxMe+67xnO9Y+4VAibARL/iKuR7nJB/0GC0NIjPhVTQSJ\ndXw2qOr49hkTshTu5Hx8Xi0R2OOQxpQ3xcYAQX+4832bFZX2zopl0dCBi6Xd4THs\n1mREjBmEC0HLnQdEGp0UhkbPsaGtxhuWyTZdKw8PfLvvJAT+SYEG6sbPBAtTt8PL\nP8p3wuekD3fv4UsGQJVlTRyzr7+19Vv7+lDXXPEPWQKBgQDvcTLsJW6xFsDv38iv\nCl+Yx0LxRqP8xopDTKicgVzamUDLfAKS9sKVKbosDEPorKXtWFw9criZK6Mp1/kY\n3k0aXUpOjhoos5W2zYnW5AFicA2A2p8gnQSNWdq/BuNnwZ2OTB9V+osYvBRLBebE\nLD1b2txg2bXJw1rwAfw/wpbKNwKBgQDq0wa8uIj8ws/1gbLCc62bWRKWy9HjGQN0\nDyD1+aUkHkNGXnCMlqeGVjGIbL3lzhKPrAfyj6yrPGWKRgENzxTwtby5zfL1nc8+\nFKCVHVxdJI94BVygYJHZazpR+P3i7OMJAGNuj5GWb2G8Rwh1Ivh+bp6Ubg+AGJWZ\nYITr9Hb9qwKBgFEK+XdgPBUIZIlMLzq/wheN6iSMClk2QfoBalh+mJUMphe5g42G\no9mk4/SguiN4vDiXXbEWsVB2qqUxCojWRTaVON9ZzZTVI+lZrDvltGpDDu78EDwT\nqUTGkvlxNWsa518QeNK7GHVow12ZQ8BGUQZUD59gUN1Xl+IAagaSsEMFAoGAVdUq\nykKdd95xiyiMQb1swLLPM6Vuo5baB0scXiyRK2GQb6FHfGv48gaBdn9g7iXj7PYR\ntZzEnZam+uLZscV2vwF+6V+ZJiQ3w1Zg2AByaW1ar6EuGUUTKqiiGaJskszJs9mb\nfqclrRorXFmOgtp0gCpI9rJAIi9aR0TbcS/bap8CgYApOPSuEClHMYHLZSCL7FB8\nmK4OIUTZBHZe0rMZMeG9wBJqDMcmBVJqBgAHzXKq6c4Qa+2Vd67pBe4K+DEWhvmZ\nExaT2xl71jUK+53Y0eQjMWD1bNrjbzZUFRffafwmTjmAsRU91CVpyT7TitwoIrDH\nef9qUoU3bFIXDXSfLraJZg==\n-----END PRIVATE KEY-----\n',
    }),
})

export const firestore = firebase.firestore()

export interface Conversation {
    role: 'assistant' | 'user'
    content: string
}

interface EvaDbData {
    articleIds?: string[]
    conversations?: Conversation[]
}

export const getData = async (id: string): Promise<EvaDbData> => {
    const snap = await firestore.collection('eva').doc(id).get()
    return snap.data() as any
}

export const setData = async (id: string, data: EvaDbData) => {
    await firestore.collection('eva').doc(id).set(data, { merge: true })
}
