import { GraphQLServer } from 'graphql-yoga'

const users = [
  {
    id: 1,
    name: "Roy",
    email: "roy@gmail.com",
    age: 32
  },
  {
    id: 2,
    name: "Moss",
    email: "moss@gmail.com",
    age: 30
  },
  {
    id: 3,
    name: "Jen",
    email: "jen@gmail.com"
  },
]

// TypeDefinitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser( user: User!): User!
  }

  type User {
    id: ID!
    email: String!
    // name: String
    age: Int
  }
`


// Resolvers
const resolvers = {
  Query: {
    users() {
      return users
    }
  },
  Mutation: {
    addUser(parent, args, ctx, info) {
      const user = {
        id: args.id,
        name: args.name,
        email: args.email,
        age: args.age
      }

      users.push(user)

      return user
    }
  }
}

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log("Server is up on port 4000")
})