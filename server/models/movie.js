const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    movieData: {
        type: Object,
        required: true
    }
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};