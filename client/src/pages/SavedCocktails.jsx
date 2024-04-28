import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_COCKTAIL } from '../utils/mutations';
import { removeCocktailId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedCocktails = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeCocktail, { error }] = useMutation(REMOVE_COCKTAIL);

  const userData = data?.me || {};

  // create function that accepts the cocktail's mongo _id value as param and deletes the cocktail from the database
  const handleDeleteCocktail = async (cocktailId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeCocktail({
        variables: { cocktailId },
      });

      // upon success, remove cocktail's id from localStorage
      removeCocktailId(cocktailId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5 fluid">
        <Container>
          <h1>Viewing {userData.username}'s saved cocktails!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedCocktails?.length
            ? `Viewing ${userData.savedCocktails.length} saved ${userData.savedCocktails.length === 1 ? 'cocktail' : 'cocktails'
            }:`
            : 'You have no saved cocktails!'}
        </h2>
        <div>
          <Row>
            {userData.savedCocktails?.map((cocktail) => { 
              return (
                <Col md="4" key={cocktail.cocktailId}> 
                  <Card border="dark">
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
                      <p className="small">Alcoholic: {cocktail.alcoholic ? 'Yes' : 'No'}</p>
                      <p className="small">Glass: {cocktail.glass}</p>
                      <Card.Text>{cocktail.instructions}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteCocktail(cocktail.cocktailId)}
                      >
                        Delete this Cocktail!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default SavedCocktails;
