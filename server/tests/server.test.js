const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Movie} = require('./../models/movie');
const {Comment} = require('./../models/comment');
const {seedMovies, seedComments, populateMovies, populateComments} = require('./seed/seed');

beforeEach(populateMovies);
beforeEach(populateComments);

describe('POST /movies', () => {
    it('should add a new movie', () => {
        const name = "Ocean's Eleven";
        return request(app)
            .post('/movies')
            .send({name})
            .expect(200)
            .expect(response => {
                expect(response.body.name).toBe(name);
                expect(response.body.movieData).toBeTruthy();
                expect(response.error).toBeFalsy();
            })
            .then(() => Movie.find({name}))
            .then(movies => expect(movies.length).toBe(1)) //check if movie was added correctly
            .then(() => Movie.find({}))
            .then(movies => expect(movies.length).toBe(3))
            .catch((error) => {
                throw new Error(error)
            })

    });

    it('should return an error if given no name', () => {
        return request(app)
            .post('/movies')
            .send({})
            .expect(400)
            .expect(response => {
                expect(response.error).toBeTruthy();
                expect(response.body).toMatchObject({error: 'Movie name required!'});
            })
            .then(() => Movie.find({}))
            .then(movies => expect(movies.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })

    });

    it('should return an error if name not found', () => {
        const name = 'fdasjfghadfgdailfsgk';
        return request(app)
            .post('/movies')
            .send({name})
            .expect(400)
            .expect(response => {
                expect(response.error).toBeTruthy();
                expect(response.body).toMatchObject({error: 'Movie not found!'});
            })
            .then(() => Movie.find({}))
            .then(movies => expect(movies.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })

    });
});

describe('GET /movies', () => {
    it('should return a list of all movies in the test database', () => {
        return request(app)
            .get('/movies')
            .expect(200)
            .expect(response => expect(response.body.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies sorted by title (ascending)', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'sort',
                'criterion': 'Title',
                'direction': 'ascending'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Die Hard')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies sorted by year (descending)', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'sort',
                'criterion': 'Year',
                'direction': 'descending'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Die Hard')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies sorted by Metascore (ascending)', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'sort',
                'criterion': 'Metascore',
                'direction': 'ascending'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Die Hard')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies filtered by title', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'filter',
                'criterion': 'Title',
                'query': 'Die Hard'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Die Hard')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies filtered by year', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'filter',
                'criterion': 'Year',
                'query': '2001'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Shrek')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should return a list of movies filtered by Metascore', () => {
        return request(app)
            .get('/movies')
            .set({
                'action': 'filter',
                'criterion': 'Metascore',
                'query': '91'
            })
            .expect(200)
            .expect(response => {
                expect(response.body[0].movieData.Title).toBe('Shrek')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });
});

describe('POST /comments', () => {
    it('should add a new comment', () => {
        const text = 'Test comment!';
        return request(app)
            .post('/comments')
            .send({
                id: seedComments[0].movieID,
                text
            })
            .expect(200)
            .expect(response => {
                expect(response.body).toMatchObject({
                    text
                })
            })
            .then(() => Comment.find({}))
            .then(comments => expect(comments.length).toBe(3))
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should not add a new comment if given ID is invalid', () => {
        return request(app)
            .post('/comments')
            .send({
                id: '3312312',
                text: 'Test comment!'
            })
            .expect(400)
            .expect(response => {
                expect(response.body).toMatchObject({error: 'Not a valid ID!'})
            })
            .then(() => Comment.find({}))
            .then(comments => expect(comments.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should not add a new comment if no movie with given ID is found in the database', () => {
        return request(app)
            .post('/comments')
            .send({
                id: new ObjectID(),
                text: 'Test comment!'
            })
            .expect(400)
            .expect(response => {
                expect(response.body).toMatchObject({error: 'No movie with such ID in database!'})
            })
            .then(() => Comment.find({}))
            .then(comments => expect(comments.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })
    });
});

describe('GET /comments', () => {
    it('should fetch a list of all comments present in the database', () => {
        return request(app)
            .get('/comments')
            .expect(200)
            .expect(response => expect(response.body.length).toBe(2))
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should fetch only comments bound to given movie id', () => {
        const id = seedComments[0].movieID;
        return request(app)
            .get(`/comments/${id}`)
            .expect(200)
            .expect(response => {
                expect(response.body.length).toBe(1);
                expect(response.body[0].text).toBe('Seed comment one!')
            })
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should not fetch comments when passed invalid id', () => {
        return request(app)
            .get(`/comments/123`)
            .expect(404)
            .expect(response => expect(response.body.error).toBe('Not a valid comment ID!'))
            .catch((error) => {
                throw new Error(error)
            })
    });

    it('should not fetch comments when passed ', () => {
        return request(app)
            .get(`/comments/${new ObjectID()}`)
            .expect(404)
            .expect(response => expect(response.body.error).toBe('No movie with such ID in database or no comments ' +
                'for movie with this ID!'))
            .catch((error) => {
                throw new Error(error)
            })
    });
});