import { Path } from 'common'

export interface TestFile {
    path: string
    size: number
}

export const TestFiles = {
    image: {
        path: Path.join(__dirname, 'res', 'image.png'),
        size: 854634,
        originalname: 'image.png',
        mimetype: 'image/png'
    },
    json: {
        path: Path.join(__dirname, 'res', 'file.json'),
        size: 21,
        originalname: 'file.json',
        mimetype: 'application/json'
    },
    small: {
        path: Path.join(__dirname, 'res', 'small.txt'),
        size: 1024,
        originalname: 'small.txt',
        mimetype: 'text/plain'
    },
    large: {
        path: Path.join(__dirname, 'res', 'large.txt'),
        size: 49999999,
        originalname: 'large.txt',
        mimetype: 'text/plain'
    },
    oversized: {
        path: Path.join(__dirname, 'res', 'oversized.txt'),
        size: 50000000,
        originalname: 'oversized.txt',
        mimetype: 'text/plain'
    }
}

// TODO 파일 자체를 여기로 옮기는 방법은?
