import { createRouteMap } from '../utils'

describe('createRoutes', () => {
    /* 2단계 경로를 생성해야 한다 */
    it('Should create a 2-level path', async () => {
        const Messages = createRouteMap({ Movies: { findMovies: null, createMovies: null } })

        expect(Messages.Movies.findMovies).toEqual('Movies.findMovies')
    })

    /* 3단계 경로를 생성해야 한다 */
    it('Should create a 3-level path', async () => {
        const Messages = createRouteMap({ Apps: { Tickets: { findTickets: null } } })

        expect(Messages.Apps.Tickets.findTickets).toEqual('Apps.Tickets.findTickets')
    })

    /* prefix를 설정해야 한다 */
    it('Should set a prefix', async () => {
        const Messages = createRouteMap(
            { Movies: { findMovies: null, createMovies: null } },
            'Prefix'
        )

        expect(Messages.Movies.findMovies).toEqual('Prefix.Movies.findMovies')
    })
})
