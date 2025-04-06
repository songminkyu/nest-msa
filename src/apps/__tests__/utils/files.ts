import { Path } from 'common'
import fs from 'fs'

export interface TestFile {
    path: string
    size: number
    originalname: string
    mimetype: string
}

export const TestFiles = {
    image: {
        path: Path.join(__dirname, 'res', 'image.png'),
        size: 0,
        originalname: 'image.png',
        mimetype: 'image/png'
    },
    json: {
        path: Path.join(__dirname, 'res', 'file.json'),
        size: 0,
        originalname: 'file.json',
        mimetype: 'application/json'
    },
    small: {
        path: Path.join(__dirname, 'res', 'small.txt'),
        size: 0,
        originalname: 'small.txt',
        mimetype: 'text/plain'
    },
    large: {
        path: Path.join(__dirname, 'res', 'large.txt'),
        size: 0,
        originalname: 'large.txt',
        mimetype: 'text/plain'
    },
    oversized: {
        path: Path.join(__dirname, 'res', 'oversized.txt'),
        size: 0,
        originalname: 'oversized.txt',
        mimetype: 'text/plain'
    }
}

/* size update */
for (const key in TestFiles) {
    if (TestFiles.hasOwnProperty(key)) {
        const file = (TestFiles as any)[key]
        file.size = fs.statSync(file.path).size
    }
}
