const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = {
    Tag
}