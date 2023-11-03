const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide Recipe Name'],
        minLength: 3
    },
    description: {
        type: String,
        required: [true, 'Must Provide Recipe Description']
    },
    ingredients: {
        type: String,
        required: [true, 'Must Provide Recipe Ingredients']
    },
    foodImage: {
        type: String,
        required: [true, 'Must Provide Recipe Food Image']
    },
    instructions: {
        type: String,
        required: [true, 'Must Provide Recipe Food Instructions']
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Recipe Created By'],
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Recipe', recipeSchema);