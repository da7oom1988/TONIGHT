var mongoose = require('mongoose');

var schema = mongoose.Schema({
    userId: String,
    userName: String,
    userAvatar: Number,
    placeId: String,
    date: String,
});

module.exports = mongoose.model('going',schema);