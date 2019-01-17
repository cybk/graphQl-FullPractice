import { GraphQLServer } from 'graphql-yoga'

// type definitions (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name(){
            return 'Andrew Mead'
        },
        location() {
            return 'Guadalajara'
        },
        bio() {
            return 'Hero for hire!!'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is Up!!');
});