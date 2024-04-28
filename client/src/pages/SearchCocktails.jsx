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
import { SAVE_COCKTAIL } from '../utils/mutations';
import { saveCocktailIds, getSavedCocktailIds } from '../utils/localStorage';
import Auth from '../utils/auth';

const SearchCocktails = () => {
  const [searchedCocktails, setSearchedCocktails] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedCocktailIds, setSavedCocktailIds] = useState(getSavedCocktailIds());
  const [saveCocktail, { error }] = useMutation(SAVE_COCKTAIL); // this is never been called

  useEffect(() => {
    return () => saveCocktailIds(savedCocktailIds);
  }, [savedCocktailIds]);

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
        throw new error('something went wrong!'); 
      }

      const { drinks } = await response.json();

      console.log("Data fetched from API:", drinks); // Log data fetched from API

      // const cocktailData = drinks.map((cocktail) => ({
      //   cocktailId: cocktail.idDrink ? cocktail.idDrink : 'UNKNOWN_ID',
      //   name: cocktail.strDrink,
      //   category: cocktail.strCategory,
      //   alcoholic: cocktail.strAlcoholic === "Alcoholic",
      //   glass: cocktail.strGlass,
      //   instructions: cocktail.strInstructions,
      //   image: cocktail.strDrinkThumb || '',
      //   ingredients: [
      //     {name: cocktail.strIngredient0, measurement: null},
      //     {name: cocktail.strIngredient1, measurement: null},
      //     {name: cocktail.strIngredient2, measurement: null},
      //     {name: cocktail.strIngredient3, measurement: null},
      //     {name: cocktail.strIngredient4, measurement: null},
      //     {name: cocktail.strIngredient5, measurement: null},
      //     {name: cocktail.strIngredient6, measurement: null}, 
      //   ].filter(ingredients => ingredients.name),
      // })); OLD VERSION

      const cocktailData = drinks.map((cocktail) => ({
        cocktailId: cocktail.idDrink || 'UNKNOWN_ID', // Assign 'UNKNOWN_ID' if cocktail.idDrink is null or undefined
        name: cocktail.strDrink,
        category: cocktail.strCategory,
        alcoholic: cocktail.strAlcoholic === "Alcoholic",
        glass: cocktail.strGlass,
        instructions: cocktail.strInstructions,
        image: cocktail.strDrinkThumb || '',
        ingredients: [
          { name: cocktail.strIngredient1, measurement: cocktail.strMeasure1 },
          { name: cocktail.strIngredient2, measurement: cocktail.strMeasure2 },
          { name: cocktail.strIngredient3, measurement: cocktail.strMeasure3 },
          { name: cocktail.strIngredient4, measurement: cocktail.strMeasure4 },
          { name: cocktail.strIngredient5, measurement: cocktail.strMeasure5 },
          { name: cocktail.strIngredient6, measurement: cocktail.strMeasure6 },
          { name: cocktail.strIngredient7, measurement: cocktail.strMeasure7 },
          { name: cocktail.strIngredient8, measurement: cocktail.strMeasure8 },
          { name: cocktail.strIngredient9, measurement: cocktail.strMeasure9 },
          { name: cocktail.strIngredient10, measurement: cocktail.strMeasure10 },
          { name: cocktail.strIngredient11, measurement: cocktail.strMeasure11 },
          { name: cocktail.strIngredient12, measurement: cocktail.strMeasure12 },
          { name: cocktail.strIngredient13, measurement: cocktail.strMeasure13 },
          { name: cocktail.strIngredient14, measurement: cocktail.strMeasure14 },
          { name: cocktail.strIngredient15, measurement: cocktail.strMeasure15 }
        ].filter(ingredient => ingredient.name && ingredient.name.trim() !== ''), // Filter out null or empty ingredient names
      }));
      
      

      console.log("Cocktail Data:", cocktailData); // Log cocktail data here

      // Add logging to output the value of cocktailId
      cocktailData.forEach(cocktail => {
        console.log('Cocktail ID:', cocktail.cocktailId); 
      });

      setSearchedCocktails(cocktailData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCocktail = async (cocktailId) => {
    const cocktailToSave = searchedCocktails.find(cocktail => cocktail.cocktailId === cocktailId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !cocktailToSave) { 
      return false;
    }

    // Log cocktailToSave object just before the mutation call
  console.log("Cocktail to Save:", cocktailToSave);

    try {
      const ingredients = cocktailToSave.ingredients.map(({ name, measurement }) => ({ name, measurement }));


      console.log("Saving Cocktail Data:", cocktailToSave); // Log cocktail to save here

      await saveCocktail({
        variables: { cocktailData: { ...cocktailToSave, ingredients } },
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
                    <p className="small">Alcoholic: {cocktail.alcoholic ? 'Alcoholic' : 'Non-Alcoholic'}</p>
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
