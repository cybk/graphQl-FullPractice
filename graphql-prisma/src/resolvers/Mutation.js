import uuidv4  from 'uuid/v4'

const Mutation= {
    async createUser (parent, args, {prisma}, info){
        const userExist = await prisma.exists.User({email: args.data.email});

        if (userExist){
            throw new Error('Email already taken.');
        }

        return prisma.mutation.createUser({
            data: args.data
        }, info);
    },
    async deleteUser (parent, args, {prisma}, info) {
        const userExist = await prisma.exists.User({id: args.user});

        if(!userExist){
            throw new Error('User does not exist.');
        }

        return prisma.mutation.deleteUser({
            where: {
                id: args.user
            }
        }, info);
    },
    async updateUser(parent, args, {prisma}, info){
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },
    async createPost (parent, args, {prisma}, info){
        return prisma.mutation.createPost({ 
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info);
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