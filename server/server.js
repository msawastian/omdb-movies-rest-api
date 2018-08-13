const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./database/mongoose');
const {Movie} = require('./models/movie');

const app = express();
const port = 3000; //change later to env variable

app.use(bodyParser.json());

app.post('/movies', (request, response) => {
    const movie = new Movie({
        name: request.body.name
    });

    movie.save().then(
        document => response.send(document),
        error => response.status(400).send(error)
    )
});

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
});