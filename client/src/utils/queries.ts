import { gql } from "../__generated__/gql";

export const GET_CURRENT_USER = gql(`
    query currentUser {
        currentUser: me {
            ...UserDetails
        }
    }
`);

export const SEARCH_BOOKS = gql(`
    query searchBooks($query: String!) {
        books(q: $query) @rest(type: "Book", path: "/volumes?{args}") {
            bookId
            authors
            title
            description
            image
        }
    }
`);

type GoogleBooksResponse = {
    items: {
        id: string,
        volumeInfo: {
            title: string,
            authors?: string[],
            description: string,
            imageLinks?: {
                thumbnail?: string
            }
        }
    }[]
}

export function googleBooksTransformer(response: Response) {
    return response.json().then(({ items }: GoogleBooksResponse) => {
        return items.map(book => ({
            bookId: book.id,
            authors: book.volumeInfo.authors || ['No author to display'],
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks?.thumbnail || ''
        }));
    })
}