import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const Mutation= {
    async createUser (parent, args, {prisma}, info){

        if (args.data.password.length < 8){
            throw new Error('Password must be 8 charachters or longer');
        }

        const password = await bcrypt.hash(args.data.password, 10); // 10 is a salt

        const userExist = await prisma.exists.User({email: args.data.email});

        if (userExist){
            throw new Error('Email already taken.');
        }

        const user =  prisma.mutation.createUser({
            data: {
                ...args.data,
                password: password
            }
        });

        return {
            user,
            token: jwt.sign({userId: user.id}, 'thisisasecretkey')
        }
    },

    async loginUser(parent, args, {prisma}, info){
        const hashed = await bcrypt.hash(args.data.password, 10);

        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });

        if (!user){
            throw new Error("the user cannot be validated!");
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password);

        if(!isMatch){
            throw new Error("the user cannot be validated!");
        }

        return {
            user,
            token: jwt.sign({userId:user.id}, 'thisisasecretkey')
        }
    },

    async deleteUser (parent, args, {prisma, request}, info) {
        const userId = getUserId(request);

        const userExist = await prisma.exists.User({id: args.user});

        if(!userExist){
            throw new Error('User does not exist.');
        }

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);
    },

    async updateUser(parent, args, {prisma, request}, info){
        const userId = getUserId(request);

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },

    async createPost (parent, args, {prisma, request}, info){
        const userId = getUserId(request);
      
        return prisma.mutation.createPost({ 
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info);
    },

    async deletePost (parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExist = await prisma.exists.Post(
            {
                id: args.post, 
                author: {
                    id: userId
                } 
            });

        if (!postExist){
            throw new Error ("Unable to delete post.");
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.post
            }
        }, info);
    },

    async updatePost (parent, args, { prisma, request }, info){
        const userId = getUserId(request);

        const postExist = await prisma.exists.Post({
            id:args.post,
            author: {
                id: userId
            }
        });

        if (!postExist){
            throw new Error("Unable to update post");
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },

    async createComment (parent, args, {prisma, request}, info){
        const userId = getUserId(request);

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info);
    },

    async deleteComment (parent, args, {prisma, request}, info){
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists){
            throw new error('Unable to delete comment');
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.comment
            }
        }, info);
    },


    async updateComment (parent, args, {prisma}, info){
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists){
            throw new error('Unable to delete comment');
        }
        
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    }
}

export { Mutation as default }