const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

var Category = mongoose.model('Category', categorySchema);

const createCategory = (category) => new Category(category).save();

const getCategories = () => Category.find();


module.exports = {
    Category,
    createCategory,
    getCategories
}