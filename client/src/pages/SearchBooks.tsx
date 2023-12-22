import React, { useState, useMemo } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import { useAuth } from '../utils/auth';
import { GET_CURRENT_USER, SEARCH_BOOKS } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';

const SearchBooks = () => {
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  
  const { loggedIn } = useAuth();
  const { data: userData } = useQuery(GET_CURRENT_USER, {
    skip: !loggedIn
  });
  const savedBookIds = useMemo(() => {
    const res = new Set();
    const savedBooks = userData?.currentUser?.savedBooks || [];
    savedBooks.forEach(book => res.add(book.bookId));
    return res;
  }, [userData?.currentUser]);

  const [searchGoogleBooks, { data: searchData }] = useLazyQuery(SEARCH_BOOKS, {
    onCompleted() {
      setSearchInput('');
    },
    onError(err) {
      console.error(err);
    }
  });
  const searchedBooks = searchData?.books || [];

  const [saveBook] = useMutation(SAVE_BOOK, {
    onError(err) {
      console.error(err);
    }
  });
  
  // create method to search for books on form submit
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) {
      return false;
    }
    
    searchGoogleBooks({
      variables: {
        query: searchInput
      }
    });
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {loggedIn && (
                      <Button
                        disabled={savedBookIds.has(book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => saveBook({ variables: { book } })}>
                        {savedBookIds.has(book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
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

export default SearchBooks;
