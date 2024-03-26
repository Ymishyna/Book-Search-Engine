// // import the gql tagged template function 
// const { gql } = require("apollo-server-express");

// const typeDefs = gql`
//   type User {
//     _id: ID!
//     username: String
//     email: String
//     bookCount: Int
//     savedBooks: [Book]
//   }  
//    type Book {
//     bookId: String
//     authors: [String]
//     description: String
//     title: String
//     image: String
//     link: String
//   }  
  
//   type Auth {
//     token: ID!
//     user: User
//   }

//   input savedBook {
//     description: String
//     title: String
//     bookId: String
//     image: String
//     link: String
//     authors: [String]
//   }
//   type Query {
//     me: User
//   }

//   type Mutation {
//     login(email: String!, password: String!): Auth
//     addUser(username: String!, email: String!, password: String!): Auth
//     saveBook(bookData: savedBook!): User
//     removeBook(bookId: ID!): User
//   }

// `;

// // export the typeDefs
// module.exports = typeDefs;

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
