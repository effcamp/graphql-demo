import { GraphQLServer } from 'graphql-yoga';
import axios from 'axios';

// TypeDefinitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    posts(id:ID): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    email: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    author: User!
    title: String!
    body: String!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    name: String!
    body: String!
    email: String!
    post: Post!
  }
  `;

// Resolvers
const resolvers = {
  Query: {
    async users() {
      const users = await axios.get(`https://jsonplaceholder.typicode.com/users`)
      return users.data
        .map(({ id, name, username, email }) => ({ id, name, username, email }))

    },
    async posts(_, { id }) {
      const posts = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
      return posts.data
        .map(({ userId, id, title, body }) => ({ userId, id, title, body }))
        .filter(p => id ? p.id == id : true)
    },
    async comments() {
      const comments = await axios.get(`https://jsonplaceholder.typicode.com/comments`)
      return comments.data
        .map(({ postId, id, name, email, body }) => ({ postId, id, name, email, body }))
    }
  },
  User: {
    async posts(p) {
      const posts = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
      return posts.data
        .map(({ userId, id, title, body }) => ({ userId, id, title, body }))
        .filter(post => post.userId === p.id)
    }
  },
  Post: {
    async author(p) {
      const users = await axios.get(`https://jsonplaceholder.typicode.com/users`)
      return users.data
        .map(({ id, name, username, email }) => ({ id, name, username, email }))
        .find(u => u.id === p.userId)
    },
    async comments(p) {
      const comments = await axios.get(`https://jsonplaceholder.typicode.com/comments`)
      return comments.data
        .map(({ postId, id, name, email, body }) => ({ postId, id, name, email, body }))
        .filter(comment => comment.postId === p.id)
    }
  },
  Comment: {

    async post(p) {
      const posts = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
      return posts.data
        .map(({ userId, id, title, body }) => ({ userId, id, title, body }))
        .find(post => post.id === p.postId)
    }
  }

};

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server started on port 4000");
});
