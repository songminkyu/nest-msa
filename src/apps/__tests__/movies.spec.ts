import { expect } from '@jest/globals'
import { MovieDto, MovieGenre, MovieRating } from 'apps/cores'
import { Path, pickIds } from 'common'
import { expectEqualUnsorted, nullObjectId, objectToFields } from 'testlib'
import { createMovie, buildMovieCreateDto, createMovies, Fixture } from './movies.fixture'
import { Errors } from './utils'

/* 영화 통합 테스트 */
describe('Movies Integration Tests', () => {
    let fix: Fixture

    beforeEach(async () => {
        const { createFixture } = await import('./movies.fixture')
        fix = await createFixture()
    })

    afterEach(async () => {
        await fix?.teardown()
    })

    describe('POST /movies', () => {
        it('영화를 생성해야 한다', async () => {
            const { createDto, expectedDto } = buildMovieCreateDto()

            const { body } = await fix.httpClient
                .post('/movies')
                .attachs([{ name: 'files', file: fix.files.image.path }])
                .fields(objectToFields(createDto))
                .created()

            expect(body).toEqual(expectedDto)
        })

        it('필수 필드가 누락되면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .post('/movies')
                .body({})
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })
    })

    describe('PATCH /movies/:id', () => {
        let movie: MovieDto

        beforeEach(async () => {
            movie = await createMovie(fix)
        })

        it('영화 정보를 업데이트해야 한다', async () => {
            const updateDto = {
                title: 'update title',
                genre: ['Romance', 'Thriller'],
                releaseDate: new Date('2000-01-01'),
                plot: `new plot`,
                durationMinutes: 10,
                director: 'Steven Spielberg',
                rating: MovieRating.R
            }
            const expected = { ...movie, ...updateDto }

            await fix.httpClient.patch(`/movies/${movie.id}`).body(updateDto).ok(expected)
            await fix.httpClient.get(`/movies/${movie.id}`).ok(expected)
        })

        it('영화가 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient
                .patch(`/movies/${nullObjectId}`)
                .body({})
                .notFound({ ...Errors.Mongoose.DocumentNotFound, notFoundId: nullObjectId })
        })
    })

    describe('DELETE /movies/:id', () => {
        let movie: MovieDto

        beforeEach(async () => {
            movie = await createMovie(fix)
        })

        it('영화를 삭제해야 한다', async () => {
            await fix.httpClient.delete(`/movies/${movie.id}`).ok()
            await fix.httpClient
                .get(`/movies/${movie.id}`)
                .notFound({ ...Errors.Mongoose.MultipleDocumentsNotFound, notFoundIds: [movie.id] })
        })

        it('영화를 삭제하면 파일도 삭제되어야 한다', async () => {
            const fileUrl = movie.images[0]
            const fileId = Path.basename(fileUrl)

            await fix.httpClient.delete(`/movies/${movie.id}`).ok()
            await fix.httpClient
                .get(fileUrl)
                .notFound({ ...Errors.Mongoose.MultipleDocumentsNotFound, notFoundIds: [fileId] })
        })

        it('영화가 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.delete(`/movies/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /movies/:id', () => {
        let movie: MovieDto

        beforeEach(async () => {
            movie = await createMovie(fix)
        })

        it('영화 정보를 가져와야 한다', async () => {
            await fix.httpClient.get(`/movies/${movie.id}`).ok(movie)
        })

        it('영화가 존재하지 않으면 NOT_FOUND(404)를 반환해야 한다', async () => {
            await fix.httpClient.get(`/movies/${nullObjectId}`).notFound({
                ...Errors.Mongoose.MultipleDocumentsNotFound,
                notFoundIds: [nullObjectId]
            })
        })
    })

    describe('GET /movies', () => {
        let movies: MovieDto[]

        beforeEach(async () => {
            movies = await createMovies(fix)
        })

        it('기본 페이지네이션 설정으로 영화를 가져와야 한다', async () => {
            const { body } = await fix.httpClient.get('/movies').query({ skip: 0 }).ok()
            const { items, ...paginated } = body

            expect(paginated).toEqual({ skip: 0, take: expect.any(Number), total: movies.length })
            expectEqualUnsorted(items, movies)
        })

        it('잘못된 필드로 검색하면 BAD_REQUEST(400)를 반환해야 한다', async () => {
            await fix.httpClient
                .get('/movies')
                .query({ wrong: 'value' })
                .badRequest({ ...Errors.RequestValidation.Failed, details: expect.any(Array) })
        })

        it('제목의 일부로 영화를 검색할 수 있어야 한다', async () => {
            const partialTitle = 'Movie-1'
            const { body } = await fix.httpClient.get('/movies').query({ title: partialTitle }).ok()

            const expected = movies.filter((movie) => movie.title.startsWith(partialTitle))
            expectEqualUnsorted(body.items, expected)
        })

        it('장르로 영화를 검색할 수 있어야 한다', async () => {
            const genre = MovieGenre.Drama
            const { body } = await fix.httpClient.get('/movies').query({ genre }).ok()

            const expected = movies.filter((movie) => movie.genre.includes(genre))
            expectEqualUnsorted(body.items, expected)
        })

        it('개봉일로 영화를 검색할 수 있어야 한다', async () => {
            const releaseDate = movies[0].releaseDate
            const { body } = await fix.httpClient.get('/movies').query({ releaseDate }).ok()

            const expected = movies.filter(
                (movie) => movie.releaseDate.getTime() === releaseDate.getTime()
            )
            expectEqualUnsorted(body.items, expected)
        })

        it('줄거리의 일부로 영화를 검색할 수 있어야 한다', async () => {
            const partialPlot = 'plot-01'
            const { body } = await fix.httpClient.get('/movies').query({ plot: partialPlot }).ok()

            const expected = movies.filter((movie) => movie.plot.startsWith(partialPlot))
            expectEqualUnsorted(body.items, expected)
        })

        it('감독의 일부로 영화를 검색할 수 있어야 한다', async () => {
            const partialDirector = 'James'
            const { body } = await fix.httpClient
                .get('/movies')
                .query({ director: partialDirector })
                .ok()

            const expected = movies.filter((movie) => movie.director.startsWith(partialDirector))
            expectEqualUnsorted(body.items, expected)
        })

        it('등급으로 영화를 검색할 수 있어야 한다', async () => {
            const rating = MovieRating.NC17
            const { body } = await fix.httpClient.get('/movies').query({ rating }).ok()

            const expected = movies.filter((movie) => movie.rating === rating)
            expectEqualUnsorted(body.items, expected)
        })
    })

    describe('getMoviesByIds', () => {
        let movies: MovieDto[]

        beforeEach(async () => {
            movies = await createMovies(fix)
        })

        it('movieIds로 영화를 검색할 수 있어야 한다', async () => {
            const expectedMovies = movies.slice(0, 5)
            const movieIds = pickIds(expectedMovies)

            const gotMovies = await fix.moviesClient.getMoviesByIds(movieIds)

            expectEqualUnsorted(gotMovies, expectedMovies)
        })

        it('영화가 존재하지 않으면 NotFoundException을 던져야 한다', async () => {
            const promise = fix.moviesClient.getMoviesByIds([nullObjectId])

            await expect(promise).rejects.toThrow('One or more documents not found')
        })
    })
})
