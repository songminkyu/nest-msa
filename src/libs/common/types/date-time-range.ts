import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { DateUtil } from '../utils'

type DateTimeRangeOptions = { start?: Date; end?: Date; minutes?: number; days?: number }

export class DateTimeRange {
    @IsDate()
    @Type(() => Date)
    start: Date

    @IsDate()
    @Type(() => Date)
    end: Date

    static create({ start, end, minutes, days }: DateTimeRangeOptions) {
        if (start && end) {
            return { start, end }
        } else if (start) {
            if (minutes) {
                return { start, end: DateUtil.addMinutes(start, minutes) }
            } else if (days) {
                return { start, end: DateUtil.addDays(start, days) }
            }else{
                // TODO
            }
        }

        throw new Error('Invalid options provided.')
    }
}

export class PartialDateTimeRange {
    @IsDate()
    @Type(() => Date)
    start?: Date

    @IsDate()
    @Type(() => Date)
    end?: Date
}
