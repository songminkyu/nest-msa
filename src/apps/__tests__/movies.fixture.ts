import { MovieGenre, MovieRating } from 'apps/cores'
import { padNumber } from 'common'
import { HttpTestClient } from 'testlib'
import { AllTestContexts, createAllTestContexts, TestFile, TestFiles } from './utils'
import { AllProviders } from './utils/clients'

export const createMovieDto = (overrides = {}) => {
    const createDto = {
        title: `MovieTitle`,
        genre: [MovieGenre.Action],
        releaseDate: new Date('1900-01-01'),
        plot: `MoviePlot`,
        durationMinutes: 90,
        director: 'James Cameron',
        rating: MovieRating.PG,
        ...overrides
    }

    const expectedDto = { id: expect.any(String), images: expect.any(Array), ...createDto }

    return { createDto, expectedDto }
}

export const createMovie = async ({ providers }: AllTestContexts, override = {}) => {
    const { createDto } = createMovieDto(override)

    const movie = await providers.moviesClient.createMovie(createDto, [TestFiles.image])
    return movie
}

export const createMovies = async (testContext: AllTestContexts, overrides = {}) => {
    const createDtos: object[] = []

    const genres = [
        [MovieGenre.Action, MovieGenre.Comedy],
        [MovieGenre.Romance, MovieGenre.Drama],
        [MovieGenre.Thriller, MovieGenre.Western]
    ]

    const directors = ['James Cameron', 'Steven Spielberg']

    let i = 0
    genres.forEach((genre) => {
        directors.forEach((director) => {
            const tag = padNumber(i++, 3)
            const title = `title-${tag}`
            const plot = `plot-${tag}`

            createDtos.push({ title, plot, genre, director, ...overrides })
        })
    })

    return Promise.all(createDtos.map((createDto) => createMovie(testContext, createDto)))
}

export interface Fixture extends AllProviders {
    testContext: AllTestContexts
    teardown: () => Promise<void>
    httpClient: HttpTestClient
    files: { image: TestFile }
}

export async function createFixture() {
    const testContext = await createAllTestContexts()

    const teardown = async () => {
        await testContext?.close()
    }

    return {
        ...testContext.providers,
        testContext,
        teardown,
        httpClient: testContext.gatewayContext.httpClient,
        files: { image: TestFiles.image }
    }
}
