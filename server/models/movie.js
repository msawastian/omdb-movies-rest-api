const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    movieData: {
        type: Object
    }
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};