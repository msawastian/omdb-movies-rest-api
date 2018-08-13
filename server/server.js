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
    let movieData;

    if (!request.body.name) {
        return response.status(400).send({error: "Movie name required!"})
    }

    axios.get(`https://www.omdbapi.com/?t=${request.body.name}&apikey=${apiKey}`)
        .then(response => {
            if (response.data.Response === 'False') {
                throw new Error('Movie not found!')
            }

            movieData = response.data
        })
        .then(() => {
            let movie = new Movie({
                name: request.body.name,
                movieData
            });

            return movie.save()
        })
        .then(document => response.send(document))
        .catch(error => response.status(400).send({error: error.message}));
});

app.get('/movies', (request, response) => {

    Movie.find({})
        .then(movies => {
            response.send(movies)
        })

});

app.post('/comments', (request, response) => {
    const movieID = request.body.id,
        text = request.body.text;

    if (!ObjectID.isValid(movieID)) {
        return response.status(404).send({
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

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});

module.exports = {app}; //for use in testing