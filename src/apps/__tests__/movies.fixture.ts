import { padNumber, Path } from 'common'
import { MovieDto, MovieGenre, MovieRating, MoviesService } from 'apps/cores'
import { createAllTestContexts, AllTestContexts } from './utils'
import { createDummyFile } from 'testlib'

export interface Fixture {
    testContext: AllTestContexts
    moviesService: MoviesService
}

export async function createFixture() {
    const testContext = await createAllTestContexts()
    const module = testContext.coresContext.module
    const moviesService = module.get(MoviesService)

    return { testContext, moviesService }
}

export async function closeFixture(fixture: Fixture) {
    await fixture.testContext.close()
}

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

export const createMovie = async (moviesService: MoviesService, override = {}) => {
    // TODO create temp 급하게 넣었다. 재검토해라. 한 번만 생성하는게 좋다.
    const tempDir = await Path.createTempDirectory()
    const fileSize = 1024
    const filePath = Path.join(tempDir, 'image.png')
    await createDummyFile(filePath, fileSize)

    const { createDto } = createMovieDto(override)
    const movie = await moviesService.createMovie(createDto, [
        {
            originalname: 'image.png',
            mimetype: 'image/png',
            size: fileSize,
            path: filePath
        }
    ])

    return movie
}

export const createMovies = async (moviesService: MoviesService, overrides = {}) => {
    const promises: Promise<MovieDto>[] = []

    const genres = [
        [MovieGenre.Action, MovieGenre.Comedy],
        [MovieGenre.Romance, MovieGenre.Drama],
        [MovieGenre.Thriller, MovieGenre.Western]
    ]
    const directors = ['James Cameron', 'Steven Spielberg']
    let i = 0

    genres.map((genre) => {
        directors.map((director) => {
            const tag = padNumber(i++, 3)
            const title = `title-${tag}`
            const plot = `plot-${tag}`

            const promise = createMovie(moviesService, {
                title,
                plot,
                genre,
                director,
                ...overrides
            })

            promises.push(promise)
        })
    })

    return Promise.all(promises)
}
