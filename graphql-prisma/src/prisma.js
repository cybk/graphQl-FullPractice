import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',

});

const createPostForUser =  async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{id}');

    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{id name email posts {id title published}}');

    return user;
}

const updatePostForUser = async (postId, data) => {
    const post = await prisma.mutation.updatePost({
        data,
        where: {
            id: postId
        }
    }, '{author{id}}');
    const user = await prisma.mutation.users({
        where: {
            id: post.author.id
        }
    }, '{ id  name email posts { id title published }}');

    return user;
}