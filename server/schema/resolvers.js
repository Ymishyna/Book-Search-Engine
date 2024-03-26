// //const { AuthenticationError } = require("apollo-server-express");
// const { User } = require("../models");
// const { signToken, AuthenticationError } = require("../utils/auth");



// const resolvers = {
//     Query: {
//         me: async (parent, args, context) => {
//             if (context.user) {
//                 const userData = await User.findOne({ _id: context.user._id })
//                     .select("-__v -password")
                 
//                 return userData;
//             }

//             throw AuthenticationError;
//         },
//     },
//     Mutation: {

//         addUser: async (parent, args) => {
//             try {
//                 const user = await User.create(args);

//                 const token = signToken(user);
//                 return { token, user };
//             } catch (err) {
//                 console.log(err);
//             }
//         },

//         login: async (parent, { email, password }) => {
//             const user = await User.findOne({ email });

//             if (!user) {
//                 throw AuthenticationError;
//             }

//             const correctPw = await user.isCorrectPassword(password);

//             if (!correctPw) {
//                 throw AuthenticationError;
//             }

//             const token = signToken(user);
//             return { token, user };
//         },

//         saveBook: async (parent, {bookData}, context) => {
//             if (context.user) {
//                 const updatedUser = await User.findByIdAndUpdate(
//                     { _id: context.user._id },
//                     // take the input type to replace "body" as the arguement
//                     { $push: { savedBooks: bookData } },
//                     { new: true }
//                 );

//                 return updatedUser;
//             }

//             throw AuthenticationError;
//         },

//         removeBook: async (parent, {bookId}, context) => {
//             if (context.user) {
//                 const updatedUser = await User.findOneAndUpdate(
//                     { _id: context.user._id },
//                     { $pull: { savedBooks: { bookId } } },
//                     { new: true }
//                 );

//                 return updatedUser;
//             }

//             throw AuthenticationError;
//         },
//     },
// };

// module.exports = resolvers;

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Book.js
const bookSchema = require('./Book');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
