const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')


const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({_id: context.user._id}).populate('savedBooks')
      }
    }
  },
  // Important for useMutation: The resolver matches the typeDefs entry point and informs the request of the relevant data
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {

        const updatedUser = await User.findByIdAndUpdate(

          { _id: context.user._id },

          { $push: { savedBooks: book } },

          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
    
        return updatedUser;
      }
    
      throw new AuthenticationError("You need to be logged in!");
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
    }
  },
};

module.exports = resolvers;
