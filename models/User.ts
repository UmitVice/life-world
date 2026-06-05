import { Schema, model, models } from 'mongoose';

import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
    },
    username: {
        type: String,
        unique: [true, 'Username already exists'],
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    image: {
        type: String,
    },
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Property',
        },
    ]
}, {
        timestamps: true,
});

const User = models.User || model('User', UserSchema);

// Helper function for password hashing
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export default User;
