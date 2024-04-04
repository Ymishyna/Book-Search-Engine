const { Schema } = require('mongoose');

const cocktailSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  alcoholic: {
    type: Boolean,
    default: false,
  },
  glass: {
    type: String,
  },
  instructions: {
    type: String,
  },
  image: {
    type: String,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      measurement: {
        type: String,
      },
    },
  ],
});

module.exports = cocktailSchema;
