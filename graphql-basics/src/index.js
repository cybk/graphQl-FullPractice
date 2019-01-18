import { GraphQLServer } from 'graphql-yoga'

// type definitions (Schema)
const typeDefs = `
    type Query {
       title: String!
       price: Float!
       releaseYear: Int
       rating: Float
       inStock: Boolean! 
    }
`

// Resolvers
const resolvers = {
    Query: {
       title () {
           return 'some title'
       },
       price () {
            return 12.25
       },
       releaseYear () {
           return null
       },
       rating () {
           return 3.5
       },
       inStock(){
           return true
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