import { GraphQLServer } from 'graphql-yoga'
import uuidv4  from 'uuid/v4'

// demo user data

let users = [
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

let posts = [
    {
        id:'1',
        title: 'first title',
        body: 'Just a initial post for testing',
        published: true,
        author: '1'
    },
    {
        id:'2',
        title: 'second title',
        body: 'scond post used for demo',
        published: false,
        author:'1'
    },
    {
        id:'3',
        title: 'a post',
        body: 'Amlo is a looser',
        published: true,
        author:'3'
    },
    {
        id:'4',
        title: 'draft',
        body: 'this post was never published',
        published: false,
        author: '2'
    }
]

let comments = [
    {
        id: '1',
        text: 'First comment',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Second comment',
        author: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'Third comment',
        author: '2',
        post: '4'
    },
    {
        id: '3',
        text: 'forth comment',
        author: '3',
        post: '2'
    }
]

// type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: Boolean): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser (data: CreateUserInput!): User!
        deleteUser (user: ID!): User!
        createPost (data: CreatePostInput!): Post!
        createComment (data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input  CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments(parent, args, ctx, info){
            if (!args.query){
                return comments;
            }

            return comments.filter( elem => elem.text.toLowerCase().includes(args.query.toLowerCase()));
        }
    },
    Mutation: {
        createUser (parent, args, ctx, info){
            const emailTaken = users.some( elem => elem.email === args.data.email);

            if (emailTaken){
                throw new Error('Email already taken.');
            }

            const user = {
                id: uuidv4(),
                ...args.data

            }

            users.push(user);

            return user;

        },
        deleteUser (parent, args, ctx, info) {
            const userIndex = users.findIndex(elem => elem.id === args.user);

            if(userIndex < 0){
                throw new Error('User does not exist.');
            }

            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter(elem => {
               const match = elem.author === args.user;
               
               if (match){
                   comments = comments.filter((comment) => comment.post !== elem.id);
               }

               return !match
            });

            comments = comments.filter (comment => comment.author !== args.user);

            return deletedUsers[0];
        },
        createPost (parent, args, ctx, info){
            const userExists = users.some(elem => elem.id === args.data.author);
            if (!userExists){
                throw new Error('User does not exists.');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            
            posts.push(post);

            return post;
        },
        createComment (parent, args, ctx, info){
            const userExists = users.some(elem => elem.id === args.data.author);
            if (!userExists){
                throw new Error('User does not exists.');
            }

            const postExist = posts.some(elem => elem.id === args.data.post && elem.published);
            if (!postExist){
                throw new Error('Post does not exists or it has not been published.');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(elem => elem.id === parent.author);
        },
        comments(parent, args, ctx, info){
            return comments.filter(elem => elem.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find(elem => elem.id === parent.author);
        },
        post(parent, args, ctx, ingo){
            return posts.find(elem => elem.id === parent.post);
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