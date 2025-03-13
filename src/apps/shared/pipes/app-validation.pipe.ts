import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { SharedErrors } from '../shared-errors'

export class AppValidationPipe extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors) =>
                new BadRequestException({
                    ...SharedErrors.ValidationFailed,
                    details: errors.map((error) => ({
                        field: error.property,
                        constraints: error.constraints
                    }))
                }),
            enableDebugMessages: false,
            disableErrorMessages: false,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            forbidUnknownValues: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true }
        })
    }
}
