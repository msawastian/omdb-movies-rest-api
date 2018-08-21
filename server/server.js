require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const {mongoose} = require('./database/mongoose');
const {ObjectID} = require('mongodb');
const {Movie} = require('./models/movie');
const {Comment} = require('./models/comment');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); //required to parse request.body

app.post('/movies', async (request, response) => {

    if (!request.body.name) {
        return response.status(400).send({error: "Movie name required!"})
    }

    try {
        const movieResponse = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(request.body.name)}&apikey=${process.env.OMDB_API_KEY}`);

        if (movieResponse.data.Response === 'False') {
            throw new Error('Movie not found!')
        }

        const movie = await new Movie({
            name: request.body.name,
            movieData: movieResponse.data
        }).save();

        response.send(movie)
    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

app.get('/movies', async (request, response, next) => {

    const action = request.header('action'),
        actions = ['sort', 'filter'];

    if (actions.indexOf(action) === -1) { //call next route if no action header or invalid action header found
        next();
        return
    }

    const criteria = ['movieData.Title', 'movieData.Year', 'movieData.Metascore']; //array of valid mongoose queries
    let criterion = 'movieData' + '.' + request.header('criterion'); //concatenate strings to make a valid mongoose query

    const directions = ['ascending', 'descending']; //array of valid sorting directions
    let direction = request.header('direction');

    const query = request.header('query');

    if (criteria.indexOf(criterion) === -1) { //default to Title if invalid criterion specified
        criterion = 'movieData.Title';
    }

    if (directions.indexOf(direction) === -1) { //default to ascending if invalid direction specified
        direction = 'ascending'
    }

    if (action === 'filter' && !query) { //respond with error if given no query header or empty query header
        return response.status(400).send({error: 'Query header required to filter movie list!'})
    }

    switch (action) {
        case 'sort':
            try {
                const movies = await Movie.find({}).sort({
                    [criterion]: direction
                });
                response.send(movies)

            } catch (error) {
                response.status(400).send({error: error.message})
            }
            break;

        case 'filter':
            try {
                const movies = await Movie.find({[criterion]: query});

                if (!movies.length) {
                    throw new Error('No movies matching given query were found in the database!')
                }

                response.send(movies)

            } catch (error) {
                response.status(404).send({error: error.message})
            }
    }
});

app.get('/movies', async (request, response) => {
    try {
        const movies = await Movie.find({});

        response.send(movies);
    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

app.post('/comments', async (request, response) => {
    const movieID = request.body.id,
        text = request.body.text;

    if (!ObjectID.isValid(movieID)) {
        return response.status(400).send({
            error: 'Not a valid ID!'
        });
    }

    try {
        const movie = await Movie.findById(movieID);

        if (!movie) throw new Error('No movie with such ID in database!');
        if (!request.body.text) throw new Error('Comment text required!');

        const comment = new Comment({
            movieID,
            text
        });

        const savedComment = await comment.save();

        response.send(savedComment)

    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

app.get('/comments/:id?', async (request, response, next) => {
    const movieID = request.params.id;

    if (!movieID) { //fallback for cases where ID wasn't provided.
        next(); //calls route below
        return
    }

    if (!ObjectID.isValid(movieID)) {
        return response.status(404).send({
            error: 'Not a valid comment ID!'
        });
    }

    try {
        const comment = await Comment.find({movieID: movieID});
        if (!comment.length) {
            return response.status(404).send({error: 'No movie with such ID in database or no comments for movie with this ID!'})
        }
        response.send(comment)
    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

app.get('/comments', async (request, response) => {
    try {
        const comments = await Comment.find({});
        response.send(comments)
    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

app.listen(port, () => {});

module.exports = {app}; //for use in testing