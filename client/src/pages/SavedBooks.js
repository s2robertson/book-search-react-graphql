import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import { removeBookId } from '../utils/localStorage';

import { GET_ME, createCurrentUserCacheUpdater } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const currentUserCacheUpdater = createCurrentUserCacheUpdater('deleteBook')

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  const { data, loading } = useQuery(GET_ME);
  const userData = data?.currentUser;

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted(data, { variables: { bookId } }) {
      if (bookId) {
        removeBookId(bookId);
      }
    },
    onError(err) {
      console.error(err);
    },
    update: currentUserCacheUpdater
  });

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  } else if (!userData) {
    return <h2>Unable to find user data...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => deleteBook({ variables: { bookId: book.bookId } })}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
