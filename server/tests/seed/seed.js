const {ObjectID} = require('mongodb');
const {Movie} = require('./../../models/movie');
const {Comment} = require('./../../models/comment');

const seedMovieOneID = new ObjectID();
const seedMovieTwoID = new ObjectID();

const seedMovies = [
    {
        _id: seedMovieOneID,
        name: "Shrek",
        movieData: {
            title: "Shrek",
            year: "2001"
        }
    },
    {
        _id: seedMovieTwoID,
        name: "Shrek 2",
        movieData: {
            title: "Shrek 2",
            year: "2004"
        }
    }
];

const seedComments = [
    {
        _id: new ObjectID(),
        movieID: seedMovieOneID,
        text: 'Seed comment one!'
    },
    {
        _id: new ObjectID(),
        movieID: seedMovieTwoID,
        text: 'Seed comment two!'
    }
];

const populateMovies = () => {
    return Movie.remove({}).then(() => Movie.insertMany(seedMovies))

};

const populateComments = () => {
    return Comment.remove({}).then(() => Comment.insertMany(seedComments))
};



module.exports = {
    seedMovies,
    seedComments,
    populateComments,
    populateMovies
};