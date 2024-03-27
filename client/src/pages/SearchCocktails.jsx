import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
// import { SAVE_BOOK } from '../utils/mutations';
import { SAVE_COCKTAIL } from '../utils/mutations'; 
// import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { saveCocktailIds, getSavedCocktailIds } from '../utils/localStorage'; 

import Auth from '../utils/auth';

const SearchCocktails = () => {
  // create state for holding returned google api data
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());

  const [saveCocktail, { error }] = useMutation(SAVE_COCKTAIL);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveCocktailIds(savedCocktailIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { drinks } = await response.json();

      const cocktailData = drinks.map((cocktail) => ({
        cocktailId: cocktail.idDrink,
        name: cocktail.strDrink,
        category: cocktail.strCategory,
        alcoholic: cocktail.strAlcoholic === "Alcoholic",
        glass: cocktail.strGlass,
        instructions: cocktail.strInstructions,
        image: cocktail.strDrinkThumb || '',
        ingredients: [
          cocktail.strIngredient1,
          cocktail.strIngredient2,
          cocktail.strIngredient3,
          // Add more ingredients as needed
        ].filter(Boolean),
      }));

      setSearchedCocktails(cocktailData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveCocktail = async (cocktailId) => {
    // find the book in `searchedBooks` state by the matching id
    const cocktailToSave = searchedCocktails.find((cocktail) => cocktail.cocktailId === cocktailId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveCocktail({
        variables: { cocktailData: { ...cocktailToSave } },
      });
     
      setSavedCocktailIds([...savedCocktailIds, cocktailToSave.cocktailId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Cocktails!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a cocktail"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedCocktails.length
            ? `Viewing ${searchedCocktails.length} results:`
            : 'Search for a cocktail to begin'}
        </h2>
        <Row>
          {searchedCocktails.map((cocktail) => {
            return (
              <Col md="4" key={cocktail.cocktailId}>
                <Card border="dark" className='mb-3'>
                  {cocktail.image ? (
                    <Card.Img
                      src={cocktail.image}
                      alt={`The image for ${cocktail.name}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{cocktail.name}</Card.Title>
                    <p className="small">Category: {cocktail.category}</p>
                    <p className="small">Alcoholic: {cocktail.alcoholic}</p>
                    <p className="small">Glass: {cocktail.glass}</p>
                    <Card.Text>{cocktail.instructions}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedCocktailIds?.some(
                          (savedId) => savedId === cocktail.cocktailId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveCocktail(cocktail.cocktailId)}
                      >
                        {savedCocktailIds?.some((savedId) => savedId === cocktail.cocktailId)
                          ? 'Cocktail Already Saved!'
                          : 'Save This Cocktail!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchCocktails;
