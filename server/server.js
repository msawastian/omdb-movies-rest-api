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

app.post('/movies', (request, response) => {

    if (!request.body.name) {
        return response.status(400).send({error: "Movie name required!"})
    }

    axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(request.body.name)}&apikey=${process.env.OMDB_API_KEY}`)
        .then(response => {
            if (response.data.Response === 'False') {
                throw new Error('Movie not found!')
            }

            return response.data
        })
        .then(movieData => {
            let movie = new Movie({
                name: request.body.name,
                movieData
            });

            return movie.save()
        })
        .then(document => response.send(document))
        .catch(error => response.status(400).send({error: error.message}));
});

app.get('/movies', (request, response, next) => {

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
            Movie.find({})
                .sort({
                    [criterion]: direction
                })
                .then(movies => response.send(movies))
                .catch(error => response.status(400).send({error: error.message}));
            break;

        case 'filter':
            Movie.find({[criterion]: query})
                .then(movies => {
                    if (!movies.length) {
                        throw new Error('No movies matching given query were found in the database!')
                    }
                    response.send(movies)
                })
                .catch(error => response.status(404).send({error: error.message}));
    }
});

app.get('/movies', (request, response) => {
    Movie.find({}).then(movies => response.send(movies))
});

app.post('/comments', (request, response) => {
    const movieID = request.body.id,
        text = request.body.text;

    if (!ObjectID.isValid(movieID)) {
        return response.status(400).send({
            error: 'Not a valid ID!'
        });
    }

    Movie.findById(movieID)
        .then(document => {
            if (!document) {
                throw new Error('No movie with such ID in database!')
            } else if (!request.body.text) {
                throw new Error('Comment text required!')
            }

            return new Comment({
                movieID,
                text
            });
        })
        .then(comment => comment.save())
        .then(document => response.send(document))
        .catch(error => response.status(400).send({error: error.message}))
});

app.get('/comments/:id?', (request, response, next) => {
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

    Comment.find({movieID: movieID})
        .then(document => {
            if (!document.length) {
                return response.status(404).send({error: 'No movie with such ID in database or no comments for movie with this ID!'})
            }

            response.send(document)
        })
        .catch(error => response.status(400).send({error: error.message}))
});

app.get('/comments', (request, response) => {
    Comment.find({})
        .then(document => response.send(document))
        .catch(error => response.status(400).send({error: error.message}))
});

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});

module.exports = {app}; //for use in testing