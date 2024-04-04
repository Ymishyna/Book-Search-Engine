const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String
    cocktailCount: Int
    savedCocktails: [Cocktail]
  }

  type Cocktail {
    cocktailId: String!
    name: String!
    category: String
    alcoholic: Boolean
    glass: String
    instructions: String
    ingredients: [Ingredient]
    image: String
  }

  type Ingredient {
    name: String!
    measurement: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input CocktailInput {
    cocktailId: String!
    name: String!
    category: String
    alcoholic: Boolean!
    glass: String
    instructions: String
    ingredients: [IngredientInput]
    image: String
  }

  input IngredientInput {
    name: String!
    measurement: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCocktail(cocktailData: CocktailInput!): User
    removeCocktail(cocktailId: String!): User
  }
`;

module.exports = typeDefs;
