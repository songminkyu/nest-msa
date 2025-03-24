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
    private query: FilterQuery<T> = {}

    addEqual(field: keyof T, value?: any): this {
        if (value !== undefined && value !== null) {
            this.query[field] = value
        }
        return this
    }

    addId<K extends keyof T>(
        field: K & (T[K] extends Types.ObjectId ? K : never),
        id?: string
    ): this {
        if (id) {
            this.query[field] = objectId(id)
        }
        return this
    }

    addIn<K extends keyof T>(
        field: K & (T[K] extends Types.ObjectId ? K : never),
        ids?: string[] | undefined
    ): this {
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

    addRegex<K extends keyof T>(
        field: K & (T[K] extends string ? K : never),
        value?: string
    ): this {
        if (value) {
            this.query[field] = new RegExp(escapeRegExp(value), 'i')
        }
        return this
    }

    addRange<K extends keyof T>(
        field: K & (T[K] extends Date ? K : never),
        range?: { start?: Date; end?: Date }
    ): this {
        if (range) {
            const { start, end } = range
            if (start && end) {
                this.query[field] = { $gte: start, $lte: end }
            } else if (start) {
                this.query[field] = { $gte: start }
            } else if (end) {
                this.query[field] = { $lte: end }
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
