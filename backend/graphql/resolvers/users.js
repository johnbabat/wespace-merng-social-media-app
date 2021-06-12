require('dotenv').config()
const { UserInputError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY
const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'})
}


module.exports = {
    Query: {
        async getUser(parent, { userId }) {
            try {
                const user = await User.findById(userId).populate('posts');
                if (user) {
                    return user
                } else {
                    throw new Error('User not found');
                }
            } catch (err) {
                throw new Error(err)
            }
        }        
    },

    Mutation: {
        async login(parent, {username, password}) {
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username })
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async register(parent, {registerInput: { username, email, password, confirmPassword }}, context, info) {
            
            // TODO: validate user data
            const {valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // TODO: Make sure user does not already exist
            const nameUser = await User.findOne({ username })
            const mailUser = await User.findOne({ email })

            if ( nameUser ) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            if ( mailUser ) {
                throw new UserInputError('Email is taken', {
                    errors: {
                        email: 'This email is taken'
                    }
                });
            }

            // TODO: Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}