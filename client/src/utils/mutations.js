import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_COCKTAIL = gql`
  mutation saveCocktail($cocktailData: CocktailInput!) {
    saveCocktail(cocktailData: $cocktailData) {
      _id
      username
      email
      savedCocktails {
        cocktailId
        name
        category
        instructions
        glass
        image
      }
    }
  }
`;

export const REMOVE_COCKTAIL = gql`
  mutation removeCocktail($cocktailId: ID!) {
    removeCocktail(cocktailId: $cocktailId) {
      _id
      username
      email
      savedCocktails {
        cocktailId
        name
        category
        instructions
        glass
        image
      }
    }
  }
`;
