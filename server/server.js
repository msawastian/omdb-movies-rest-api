require('./config/config.js');

const apiKey = '3183d87d';

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

    axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(request.body.name)}&apikey=${apiKey}`)
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
        actions = ['sort', 'filter'],
        criteria = ['movieData.Title', 'movieData.Year', 'movieData.Metascore'],
        direction = request.header('direction');

    let criterion = 'movieData' + '.' + request.header('criterion'), //concatenate strings to make a valid mongoose query
        query = request.header('query');

    if (actions.indexOf(action) === -1) {
        next();
        return
    }

    if (criteria.indexOf(criterion) === -1) {
        criterion = 'movieData.Title';
    }

    if (action === 'sort') {
        Movie.find({})
            .sort({
                [criterion]: direction
            })
            .then(movies => response.send(movies))
            .catch(error => response.status(400).send({error: error.message}))
    }

    if (action === 'filter') {
        const key = 'movieData' + '.' + criterion; //mongoose doesn't support template strings
        Movie.find({[key]: query})
            .then(movies => {
                response.send(movies)
            })
            .catch(error => console.log(error))
    }
});

app.get('/movies', (request, response) => {
    console.log('fallback');
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

    Movie.findById(ObjectID(movieID))
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

    if (movieID && !ObjectID.isValid(movieID)) {
        return response.status(404).send({
            error: 'Not a valid comment ID!'
        });
    }


    Comment.find({movieID: ObjectID(movieID)})
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
        .then(document => {
            response.send(document)
        })
        .catch(error => response.status(400).send({error: error.message}))
});

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});

module.exports = {app}; //for use in testing