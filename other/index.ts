import { GraphQLServer } from 'graphql-yoga'

const users = [
  {
    id: 1,
    name: "Roy",
    age: 31
  },
  {
    id: 2,
    name: "Moss",
    age: 35
  },
  {
    id: 3,
    name: "Jen"
  },
]

// TypeDefinitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
  }
  type Mutation {
     createUser(id: ID!, name:String!, age: Int) : User!
  }

  type User {
    id: ID!
    name: String!
    age: Int
  }
  `


// Resolvers
const resolvers = {
  Query: {
    users() {
      return users;
    }
  },
  Mutation: {
    createUser(_, args) {
      const user = {
        id: args.id,
        name: args.name,
        age: args.age
      }
      users.push(user);
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
  console.log("Server started on port 4000")
})
