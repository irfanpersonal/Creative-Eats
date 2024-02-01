import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    bio: string
    location: string,
    profilePicture: string,
    followers: mongoose.Schema.Types.ObjectId[],
    following: mongoose.Schema.Types.ObjectId[],
    comparePassword: (guess: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 5,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        validate: {
            validator: (value: string) => {
                return validator.isEmail(value);
            },
            message: 'Invalid Email Address'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password']
    },
    bio: {
        type: String,
        required: [true, 'Must Provide User Bio']
    },
    location: {
        type: String,
        required: [true, 'Must Provide User Location']
    },
    profilePicture: {
        type: String,
        required: [true, 'Must Provide User Profile Picture']
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

userSchema.pre('save', async function(this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const randomBytes = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, randomBytes);
});

userSchema.methods.comparePassword = async function(this: IUser, guess: string) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

userSchema.virtual('recipes', {
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

export default mongoose.model<IUser>('User', userSchema);