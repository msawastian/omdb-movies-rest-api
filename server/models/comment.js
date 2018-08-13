const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    movieID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment};