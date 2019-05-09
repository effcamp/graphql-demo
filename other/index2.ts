import { GraphQLServer } from 'graphql-yoga';
import axios from 'axios';


const loadUsers = async () => {
  const allUsers = await axios.get(`https://jsonplaceholder.typicode.com/users`)
  return allUsers.data.map(({ id, name, username, email }) => ({ id, name, username, email }))
}

const loadPosts = async () => {
  const allPosts = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
  return allPosts.data.map(({ userId, id, title, body }) => ({ userId, id, title, body }))
}

const loadComments = async () => {
  const allComments = await axios.get(`https://jsonplaceholder.typicode.com/comments`)
  return allComments.data.map(({ postId, id, name, email, body }) => ({ postId, id, name, email, body }))
}
let users
let posts
let comments

loadUsers().then(res => users = res)
loadPosts().then(res => posts = res)
loadComments().then(res => comments = res)

// TypeDefinitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    posts: [Post!]!
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

// type Mutation {
//    createUser(name:String!, username:String!, email: String!, phone: String)
// }

// Resolvers
const resolvers = {
  Query: {
    me() {
      return users.find(user=> user.id === 1)
    },
    users() {
      return users;
    },
    posts() {
      return posts;
    },
    comments() {
      return comments;
    }
  },
  User: {
    posts(p) {
      return posts.filter(post => post.userId === p.id)
    }
  },
  Post: {
    author(p) {
      return users.find(u => u.id === p.userId)
    },
    comments(p){
      return comments.filter(comment => comment.postId === p.id)
    }
  },
  Comment: {
   
    post(p){
      return posts.find(post => post.id === p.postId)
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
