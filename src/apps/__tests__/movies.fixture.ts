import { MovieGenre, MovieRating } from 'apps/cores'
import { padNumber } from 'common'
import { CommonFixture, createCommonFixture, TestFile, TestFiles } from './utils'

// todo buildMovieCreateDto
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

export const createMovie = async (fix: CommonFixture, override = {}) => {
    const { createDto } = createMovieDto(override)

    const movie = await fix.moviesClient.createMovie(createDto, [TestFiles.image])
    return movie
}

export const createMovies = async (fix: CommonFixture, overrides = {}) => {
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

    return Promise.all(createDtos.map((createDto) => createMovie(fix, createDto)))
}

export interface Fixture extends CommonFixture {
    teardown: () => Promise<void>
    files: { image: TestFile }
}

export async function createFixture() {
    const commonFixture = await createCommonFixture()

    const teardown = async () => {
        await commonFixture?.close()
    }

    return { ...commonFixture, teardown, files: { image: TestFiles.image } }
}
