import { expect } from '@jest/globals'
import { MovieDto, MovieGenre, MovieRating } from 'apps/cores'
import { Path, pickIds } from 'common'
import { expectEqualUnsorted, nullObjectId, objectToFields } from 'testlib'
import { buildMovieCreateDto, createMovie } from './common.fixture'
import { Fixture } from './movies.fixture'
import { Errors } from './utils'

describe('Movies', () => {
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
                .attachs([{ name: 'files', file: fix.image.path }])
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
            movies = await Promise.all([
                createMovie(fix, {
                    title: 'title-a1',
                    plot: 'plot-a1',
                    director: 'James Cameron',
                    releaseDate: new Date('2000-01-01'),
                    rating: MovieRating.NC17,
                    genre: [MovieGenre.Action, MovieGenre.Comedy]
                }),
                createMovie(fix, {
                    title: 'title-a2',
                    plot: 'plot-a2',
                    director: 'Steven Spielberg',
                    releaseDate: new Date('2000-01-02'),
                    rating: MovieRating.NC17,
                    genre: [MovieGenre.Romance, MovieGenre.Drama]
                }),
                createMovie(fix, {
                    title: 'title-b1',
                    plot: 'plot-b1',
                    director: 'James Cameron',
                    releaseDate: new Date('2000-01-02'),
                    rating: MovieRating.PG,
                    genre: [MovieGenre.Drama, MovieGenre.Comedy]
                }),
                createMovie(fix, {
                    title: 'title-b2',
                    plot: 'plot-b2',
                    director: 'Steven Spielberg',
                    releaseDate: new Date('2000-01-03'),
                    rating: MovieRating.R,
                    genre: [MovieGenre.Thriller, MovieGenre.Western]
                })
            ])
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
            const { body } = await fix.httpClient.get('/movies').query({ title: 'title-a' }).ok()

            expectEqualUnsorted(body.items, [movies[0], movies[1]])
        })

        it('장르로 영화를 검색할 수 있어야 한다', async () => {
            const { body } = await fix.httpClient
                .get('/movies')
                .query({ genre: MovieGenre.Drama })
                .ok()

            expectEqualUnsorted(body.items, [movies[1], movies[2]])
        })

        it('개봉일로 영화를 검색할 수 있어야 한다', async () => {
            const { body } = await fix.httpClient
                .get('/movies')
                .query({ releaseDate: new Date('2000-01-02') })
                .ok()

            expectEqualUnsorted(body.items, [movies[1], movies[2]])
        })

        it('줄거리의 일부로 영화를 검색할 수 있어야 한다', async () => {
            const { body } = await fix.httpClient.get('/movies').query({ plot: 'plot-b' }).ok()

            expectEqualUnsorted(body.items, [movies[2], movies[3]])
        })

        it('감독의 일부로 영화를 검색할 수 있어야 한다', async () => {
            const { body } = await fix.httpClient.get('/movies').query({ director: 'James' }).ok()

            expectEqualUnsorted(body.items, [movies[0], movies[2]])
        })

        it('등급으로 영화를 검색할 수 있어야 한다', async () => {
            const { body } = await fix.httpClient
                .get('/movies')
                .query({ rating: MovieRating.NC17 })
                .ok()

            expectEqualUnsorted(body.items, [movies[0], movies[1]])
        })
    })

    describe('getMoviesByIds', () => {
        let movies: MovieDto[]

        beforeEach(async () => {
            movies = await Promise.all([
                createMovie(fix),
                createMovie(fix),
                createMovie(fix),
                createMovie(fix),
                createMovie(fix)
            ])
        })

        it('movieIds로 영화를 검색할 수 있어야 한다', async () => {
            const expectedMovies = movies.slice(0, 3)
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
