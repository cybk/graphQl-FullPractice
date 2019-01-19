import { GraphQLServer } from 'graphql-yoga'

// demo user data

const users = [
    {
        id: '1',
        name: 'Juan',
        email: 'Juan@fake.com',
        age: 20
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'Sarah@fake.com',
        age: 25
    },
    {
        id: '3',
        name: 'Mike',
        email: 'Mike@fake.com',
        age: 18
    }
]

const posts = [
    {
        id:'1',
        title: 'first title',
        body: 'Just a initial post for testing',
        published: true
    },
    {
        id:'2',
        title: 'second title',
        body: 'scond post used for demo',
        published: false
    },
    {
        id:'3',
        title: 'a post',
        body: 'Amlo is a looser',
        published: true
    },
    {
        id:'4',
        title: 'draft',
        body: 'this post was never published',
        published: false
    }
]


// type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: Boolean): [Post!]!
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
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if (!args.query){
                return users
            }

            return users.filter(elem => 
                    elem.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info){
            if(!args.query){
                return posts
            }

            return posts.filter(elem => elem.published == args.query)
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
               published: true
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