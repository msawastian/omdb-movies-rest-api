const {ObjectID} = require('mongodb');
const {Movie} = require('./../../models/movie');

const seedMovieOneID = new ObjectID();
const seedMovieTwoID = new ObjectID();

const seedMovies = {
    seedMovieOne: {
        _id: seedMovieOneID,
        name: "Shrek",
        movieData: {
            title: "Shrek",
            year: "2001"
        }
    },
    seedMovieTwo: {
        _id: seedMovieTwoID,
        name: "Shrek 2",
        movieData: {
            title: "Shrek 2",
            year: "2004"
        }
    }
};

const populateMovies = done => {
    Movie.remove({})
        .then(() => Movie.insertMany(seedMovies))
        .then(() => done())
};

module.exports = {
    seedMovies,
    populateMovies
};