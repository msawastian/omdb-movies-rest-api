const apiKey = '3183d87d';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const {mongoose} = require('./database/mongoose');
const {Movie} = require('./models/movie');

const app = express();
const port = 3000; //change later to env variable

app.use(bodyParser.json());

app.post('/movies', (request, response) => {

    if (!request.body.name) {
        return response.status(400).send({error: "Movie name required"})
    }

    let movieData; //variable init after body.name check to avoid initializing it needlessly

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

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
});