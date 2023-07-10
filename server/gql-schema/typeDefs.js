const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: ID!
        title: String!
        description: String!
        authors: [String]
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        savedBooks: [Book]
    }

    type LoginDetails {
        user: User!
        token: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): LoginDetails
        login(email: String!, password: String!): LoginDetails
        saveBook(bookId: ID!, title: String!, description: String!, authors: [String], image: String, link: String): User
        deleteBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;