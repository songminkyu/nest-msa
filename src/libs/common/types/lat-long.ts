import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { IsNumber, Max, Min, validate } from 'class-validator'
import { CommonErrors } from '../common-errors'

export class LatLong {
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number

    static distanceInMeters(latlong1: LatLong, latlong2: LatLong) {
        const toRad = (degree: number) => degree * (Math.PI / 180)
        const R = 6371000 // earth radius in meters

        const lat1 = toRad(latlong1.latitude)
        const lon1 = toRad(latlong1.longitude)
        const lat2 = toRad(latlong2.latitude)
        const lon2 = toRad(latlong2.longitude)

        const dLat = lat2 - lat1
        const dLon = lon2 - lon1

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distanceInMeters = R * c

        return distanceInMeters
    }
}

@Injectable()
class LatLongPipe implements PipeTransform<string, Promise<LatLong>> {
    async transform(value: string): Promise<LatLong> {
        if (!value) {
            throw new BadRequestException(CommonErrors.LatLong.Required)
        }

        const [latStr, longStr] = value.split(',')

        if (!latStr || !longStr) {
            throw new BadRequestException(CommonErrors.LatLong.FormatInvalid)
        }

        const latLong = plainToClass(LatLong, {
            latitude: parseFloat(latStr),
            longitude: parseFloat(longStr)
        })

        const errors = await validate(latLong)
        if (errors.length > 0) {
            throw new BadRequestException({
                ...CommonErrors.LatLong.ValidationFailed,
                details: errors.map((error) => ({
                    field: error.property,
                    constraints: error.constraints
                }))
            })
        }

        return latLong
    }
}

export const LatLongQuery = createParamDecorator(async (name: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const latlong = request.query[name]

    const pipe = new LatLongPipe()
    return pipe.transform(latlong)
})
