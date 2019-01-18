import { GraphQLServer } from 'graphql-yoga'

// type definitions (Schema)
const typeDefs = `
    type Query {
        add(elem1: Float!, elem2: Float!): Float!
        greeting(name: String): String!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int

    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        add(parent, args){
            return args.elem1 + args.elem2
        },
        greeting(parent, args, ctx, info){
            console.log('args', args);
            return `Hello ${args.name}`;
        },
        me () {
           return {
               id: 'abc123',
               name: 'Andrew some',
               email: 'fake@123.com',
           }
        },
        post () {
           return {
               id: 'cba321',
               title: 'test post',
               body: 'some a cool body!',
               published: 'some one'
           }
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