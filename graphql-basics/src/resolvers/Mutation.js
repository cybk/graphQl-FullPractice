import uuidv4  from 'uuid/v4'

const Mutation= {
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
}

export { Mutation as default }