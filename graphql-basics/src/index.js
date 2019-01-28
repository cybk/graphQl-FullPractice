import { GraphQLServer } from 'graphql-yoga'
import uuidv4  from 'uuid/v4'
import db from './db'

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, {db}, info) {
            if (!args.query){
                return db.users
            }

            return db.users.filter(elem => 
                    elem.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, {db}, info){
            if(!args.query){
                return db.posts
            }

            return db.posts.filter(elem => elem.published == args.query)
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
        comments(parent, args, {db}, info){
            if (!args.query){
                return db.comments;
            }

            return db.comments.filter( elem => elem.text.toLowerCase().includes(args.query.toLowerCase()));
        }
    },
    Mutation: {
        createUser (parent, args, {db}, info){
            const emailTaken = db.users.some( elem => elem.email === args.data.email);

            if (emailTaken){
                throw new Error('Email already taken.');
            }

            const user = {
                id: uuidv4(),
                ...args.data

            }

            db.users.push(user);

            return user;

        },
        deleteUser (parent, args, {db}, info) {
            const userIndex = db.users.findIndex(elem => elem.id === args.user);

            if(userIndex < 0){
                throw new Error('User does not exist.');
            }

            const deletedUsers = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter(elem => {
               const match = elem.author === args.user;
               
               if (match){
                   comments = db.comments.filter((comment) => comment.post !== elem.id);
               }

               return !match
            });

            db.comments = db.comments.filter (comment => comment.author !== args.user);

            return deletedUsers[0];
        },
        createPost (parent, args, {db}, info){
            const userExists = db.users.some(elem => elem.id === args.data.author);
            if (!userExists){
                throw new Error('User does not exists.');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            
            db.posts.push(post);

            return post;
        },
        deletePost (parent, args, {db}, info) {
            const postIndex = db.posts.findIndex(elem => elem.id === args.post);

            if (postIndex < 0){
                throw new Error ("Post does not exist.");
            }

            const deletedPost = db.posts.splice(postIndex, 1);

            db.comments = db.comments.filter(comment => comment.post !== args.post);

            return deletedPost[0];
        },
        createComment (parent, args, {db}, info){
            const userExists = db.users.some(elem => elem.id === args.data.author);
            if (!userExists){
                throw new Error('User does not exists.');
            }

            const postExist = db.posts.some(elem => elem.id === args.data.post && elem.published);
            if (!postExist){
                throw new Error('Post does not exists or it has not been published.');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            db.comments.push(comment);

            return comment;
        },
        deleteComment (parent, args, {db}, info){
            const commentIndex = db.comments.findIndex(elem => elem.id === args.comment);

            if (commentIndex < 0){
                throw new Error("Comment does not exist.");
            }

            const deletedComment = db.comments.splice(commentIndex, 1);

            return deletedComment[0];

        }
    },
    Post: {
        author(parent, args, {db}, info) {
            return db.users.find(elem => elem.id === parent.author);
        },
        comments(parent, args, {db}, info){
            return db.comments.filter(elem => elem.post === parent.id);
        }
    },
    User: {
        posts(parent, args, {db}, info){
            return db.posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, {db}, info){
            return db.comments.filter(comment => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, {db}, info){
            return db.users.find(elem => elem.id === parent.author);
        },
        post(parent, args, {db}, ingo){
            return db.posts.find(elem => elem.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(() => {
    console.log('Server is Up!!');
});