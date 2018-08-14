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
            Title: "Shrek",
            Year: "2001",
            Metascore: '91'
        }
    },
    {
        _id: seedMovieTwoID,
        name: "Die Hard",
        movieData: {
            Title: "Die Hard",
            Year: "2004",
            Metascore: '84'
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