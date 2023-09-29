const typeDefs = `
 input BookInput {
   bookId: ID!
   authors: [String]
   description: String!
   image: String
   link: String
   title: String!

  }

type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(userId: ID!, username: String): User
    me: User
  }
  
 



  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
    login(email: String!, password: String!): Auth
  }
  

  
`

module.exports = typeDefs;
