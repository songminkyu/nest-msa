export function uniqueWhenTesting(prefix: string) {
    const testId = process.env.TEST_ID

    if (process.env.NODE_ENV === 'test' && testId !== undefined) {
        return `${prefix}-${testId}`
    }

    return prefix
}

type Paths<T, ParentPath extends string = ''> = {
    [K in keyof T]: T[K] extends object
        ? Paths<T[K], `${ParentPath}${K & string}.`>
        : `${ParentPath}${K & string}`
}

/**
 * 'createRouteMap' is a function that converts the input object to a string.
 * This function replaces each leaf node of the object with a string separated by dots (.) that represent the path.
 * It is mainly used alongside the '@MessagePattern' decorator to define message patterns consistently.
 *
 * 'createRouteMap'은 입력된 객체를 문자열로 변환해주는 함수입니다.
 * 이 함수는 객체의 각 리프(leaf) 노드를 해당 경로를 나타내는 점(.)으로 구분된 문자열로 바꿔줍니다.
 * 주로 '@MessagePattern' 데코레이터와 함께 메시지 패턴을 일관되게 정의하기 위해 사용됩니다.
 *
 * For example, given an object like this:
 * {
 *   Booking: {
 *     searchShowingTheaters: null
 *   }
 * }
 * The result would be:
 * {
 *   Booking: {
 *     searchShowingTheaters: "Booking.searchShowingTheaters"
 *   }
 * }
 * This result is used in a format such as '@MessagePattern(Messages.Booking.searchShowingTheaters)'.
 */
export function createRouteMap<T extends Record<string, any>>(
    obj: T,
    parentPath: string = ''
): Paths<T> {
    const result: any = {}
    for (const key in obj) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key
        const value = obj[key]

        if (typeof value === 'object' && value !== null) {
            result[key] = createRouteMap(value, currentPath)
        } else {
            result[key] = currentPath
        }
    }
    return result as Paths<T>
}
