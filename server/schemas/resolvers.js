const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    saveCocktail: async (parent, { cocktailData }, context) => {
      if (context.user) {
        // Log cocktailData before mutation call
        console.log("Cocktail Data received:", cocktailData);
        // Ensure that cocktailId is not null and is included in cocktailData
        if (!cocktailData.cocktailId) {
          throw new Error('Cocktail ID is missing or null');
        }

        // Log context.user._id to ensure it's retrieved correctly
    console.log("User ID:", context.user._id);
    
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedCocktails: cocktailData } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError;
    },
    removeCocktail: async (parent, { cocktailId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedCocktails: { cocktailId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
