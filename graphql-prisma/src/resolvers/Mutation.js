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
    updateUser(parent, {id, data}, {db}, info){

        const user = db.users.find(user => user.id === id);

        if (!user){
            throw new Error("User does not exist");
        }

        if (typeof data.email === 'string'){
            const emailTaken = db.users.some(user => user.email === data.email);

            if (emailTaken){
                throw new Error('the email is in use');
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string'){
            user.name = data.name;
        }

        if (typeof data.age !== undefined){
            user.age = data.age;
        }

        return user;
    },
    createPost (parent, args, {db, pubsub}, info){
        const userExists = db.users.some(elem => elem.id === args.data.author);
        if (!userExists){
            throw new Error('User does not exists.');
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }
        
        db.posts.push(post);
        if (post.published){
            pubsub.publish('post', {
                post:{
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost (parent, args, {db}, info) {
        const postIndex = db.posts.findIndex(elem => elem.id === args.post);

        if (postIndex < 0){
            throw new Error ("Post does not exist.");
        }

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.post);

        if (post.published){
            pubsub.publish('post', {
                post:{
                    mutation: 'DELETED',
                    data: post
                }
            });
        }

        return deletedPost[0];
    },
    updatePost (parent, args, {db, pubsub}, info){
        const  {id, data} = args;
        const post = db.posts.find(elem => elem.id == id);
        const originalPost = {...post};

        if (!post){
            throw new Error('Post does not exist.');
        }

        if (typeof data.title === 'string'){
            post.title = data.title;
        }

        if (typeof data.body === 'string'){
            post.body = data.body;
        }

        if (typeof data.published === 'boolean'){
            post.published = data.published;

            if (originalPost.published && !post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            }else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });

            } 
        } else if(post.published ){
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    createComment (parent, args, {db, pubsub}, info){
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
        
        pubsub.publish(`comment ${args.data.post}`, {
          comment: {
              mutation: 'CREATED',
              data: comment
          }  
        });

        return comment;
    },
    deleteComment (parent, args, {db, pubsub}, info){
        const commentIndex = db.comments.findIndex(elem => elem.id === args.comment);

        if (commentIndex < 0){
            throw new Error("Comment does not exist.");
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });

        return deletedComment;

    },
    updateComment (parent, args, {db, pubsub}, info){
        const { id, text} = args;
        const comment = db.comments.find(elem => elem.id === id);

        if (!comment){
            throw new Error('Comment does not exist.');
        }

        if (typeof text === 'string'){
            comment.text = text;
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment;
    }
}

export { Mutation as default }