import { GraphQLServer } from 'graphql-yoga';

// TypeDefinitions (schema)
const users = [
  {
    id: 1,
    name: "Fred",
    email: "fred@test.com",
    friends: [2, 3, 4]
  },
  {
    id: 2,
    name: "Tom",
    email: "tom@test.com",
    friends: [1, 2, 3, 5]
  },
  {
    id: 3,
    name: "Jack",
    email: "jack@test.com",
    friends: [2, 3, 4]

  },
  {
    id: 4,
    name: "Nancy",
    email: "nancy@test.com",
    friends: [1, 5, 3, 4]

  },
  {
    id: 5,
    name: "Carla",
    email: "carla@test.com",
    friends: [1, 4]

  },
  {
    id: 6,
    name: "Jim",
    email: "jim@test.com",
    friends: [3, 4]

  },
]

const typeDefs = `
  type Query {
    me: User!
    users: [User!]!
  }

  type User {
    id: ID!
    name: String!
    email: String
    friends: [User!]!
  }
`;


// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        name: "Fred",
        email: "fred.campos@thinkingbig.net"
      }
    },
    users() {
      return users;
    }
  },
  User: {
    friends(p, arg, ctx) {
      return users.filter(u => p.friends.includes(u.id));
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
