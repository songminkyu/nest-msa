import { ConfigService } from '@nestjs/config'

export abstract class BaseConfigService {
    constructor(private configService: ConfigService) {}

    protected getString(key: string): string {
        const value = this.configService.get<string>(key)

        if (!value) {
            console.error(`Key '${key}' is not defined`)
            process.exit(1)
        }

        return value
    }

    protected getNumber(key: string): number {
        const value = this.getString(key)

        const num = parseInt(value, 10)
        return num
    }
}
