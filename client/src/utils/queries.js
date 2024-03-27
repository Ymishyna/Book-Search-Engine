import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedCocktails {
        cocktailId
        name
        category
        alcoholic
        glass
        instructions
        ingredients {
          name
          measurement
        }
        image
      }
    }
  }
`;
