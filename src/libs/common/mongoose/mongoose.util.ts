import { BadRequestException } from '@nestjs/common'
import { escapeRegExp, uniq } from 'lodash'
import { FilterQuery, Types } from 'mongoose'
import { Expect } from '../validator'
import { MongooseErrors } from './errors'

export const newObjectId = () => new Types.ObjectId().toString()
export const objectId = (id: string) => new Types.ObjectId(id)
export const objectIds = (ids: string[]) => ids.map((id) => objectId(id))

export interface QueryBuilderOptions {
    allowEmpty?: boolean
}

export class QueryBuilder<T> {
    private query: any = {}

    addEqual(field: string, value?: any): this {
        if (value !== undefined && value !== null) {
            this.query[field] = value
        }
        return this
    }

    addId(field: string, id?: string): this {
        if (id) {
            this.query[field] = objectId(id)
        }
        return this
    }

    addIn(field: string, ids?: string[] | undefined): this {
        if (ids && ids.length > 0) {
            const uniqueIds = uniq(ids)
            Expect.equalLength(
                uniqueIds,
                ids,
                `Duplicate ${String(field)} IDs detected and removed: ${ids}`
            )
            this.query[field] = { $in: objectIds(uniqueIds) }
        }
        return this
    }

    addRegex(field: string, value?: string): this {
        if (value) {
            this.query[field] = new RegExp(escapeRegExp(value), 'i')
        }
        return this
    }

    addRange(field: string, range?: { start?: Date; end?: Date }): this {
        if (range) {
            const { start, end } = range
            if (start && end) {
                this.query[field] = { $gte: start, $lte: end }
            } else if (start) {
                this.query[field] = { $gte: start }
            } else if (end) {
                this.query[field] = { $lte: end }
            } else {
                // TODO
            }
        }
        return this
    }

    build({ allowEmpty }: QueryBuilderOptions): FilterQuery<T> {
        if (!allowEmpty && Object.keys(this.query).length === 0) {
            throw new BadRequestException(MongooseErrors.FiltersRequired)
        }

        return this.query
    }
}
