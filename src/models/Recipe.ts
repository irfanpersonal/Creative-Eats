import mongoose from 'mongoose';

export interface IRecipe extends mongoose.Document {
    name: string,
    description: string,
    category: string,
    ingredients: string[],
    budget: number,
    instructions: string[],
    coverImage: string,
    user: mongoose.Schema.Types.ObjectId
}

const recipeSchema = new mongoose.Schema<IRecipe>({
    name: {
        type: String,
        required: [true, 'Must Provide Recipe Name'],
        minlength: 5,
        maxLength: 40
    },
    description: {
        type: String,
        required: [true, 'Must Provide Recipe Description']
    },
    category: {
        type: String,
        required: [true, 'Must Provide Recipe Category'],
        enum: {
            values: ['breakfast', 'lunch', 'dinner', 'dessert'],
            message: '{VALUE} is not a supported post category!'
        }
    },
    ingredients: {
        type: [String],
        required: [true, 'Must Provide Recipe Ingredients']
    },
    budget: {
        type: Number,
        required: [true, 'Must Provide Recipe Budget']
    },
    instructions: {
        type: [String],
        required: [true, 'Must Provide Recipe Instructions']
    },
    coverImage: {
        type: String,
        required: [true, 'Must Provide Recipe Cover Image']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must Provide Recipe User'],
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model<IRecipe>('Recipe', recipeSchema);