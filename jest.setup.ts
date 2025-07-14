import dotenv from 'dotenv'
import 'reflect-metadata'
dotenv.config({ path: ['.env.test'], quiet: true })
process.env.NODE_ENV = 'test'

const generateTestId = () => {
    const characters = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'

    return Array.from(
        { length: 10 },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join('')
}

global.beforeEach(async () => {
    const testId = generateTestId()

    process.env.TEST_ID = testId
    process.env.PROJECT_ID = `project-${testId}`
    process.env.MONGO_DATABASE = `mongodb-${testId}`
})
