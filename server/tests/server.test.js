const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {seedMovies, populateMovies} = require('./seed/seed');

beforeEach(populateMovies);

describe('POST /movies', () => {
    it('should add a new movie', () => {
        const name = 'Shrek';
        return request(app)
            .post('/movies')
            .send({name})
            .expect(200)
            .expect(response => {
                expect(response.body.name).toBe(name);
                expect(response.body.movieData).toBeTruthy();
                expect(response.error).toBeFalsy();
            })
    });

    it('should return an error if given no name', () => {
        return request(app)
            .post('/movies')
            .send({})
            .expect(400)
            .expect(response => {
                expect(response.error).toBeTruthy();
                expect(response.body).toMatchObject({error: "Movie name required!"});

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
                expect(response.body).toMatchObject({error: "Movie not found!"});
            })
    })
});