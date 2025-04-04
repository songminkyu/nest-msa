import { Path } from 'common'

export interface TestFile {
    path: string
    size: number
}

export const TestFiles = {
    image: { path: Path.join('./test/fixtures', 'image.png'), size: 854634 },
    json: { path: Path.join('./test/fixtures', 'file.json'), size: 21 },
    text: { path: Path.join('./test/fixtures', 'file.txt'), size: 1024 },
    large: { path: Path.join('./test/fixtures', 'large.txt'), size: 49999999 },
    oversized: { path: Path.join('./test/fixtures', 'oversized.txt'), size: 50000000 }
}

// TODO 파일 자체를 여기로 옮기는 방법은?
