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

    async deletePost (parent, args, {prisma}, info) {
        const postExist = await prisma.exists.Post({id: args.post})

        if (!postExist){
            throw new Error ("Post does not exist.");
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.post
            }
        }, info);
    },

    async updatePost (parent, args, { prisma }, info){
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },

    async createComment (parent, args, {prisma}, info){
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
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

    async deleteComment (parent, args, {prisma}, info){
        const  commentExist = await prisma.exists.Comment({id: args.comment});

        if (!commentExist){
            throw new Error("Comment does not exist");
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.comment
            }
        }, info);
    },

    async updateComment (parent, args, {prisma}, info){
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    }
}

export { Mutation as default }