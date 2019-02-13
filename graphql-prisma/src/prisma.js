import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',

});

export {prisma as default}

// prisma.exists.Comment({
//     id: "cjrwflk7903yq0862vsks1d58"
// }).then( (exist) =>{
//     console.log('Comment exist: ', exist);
// });

// const createPostForUser =  async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId });
//     if (!userExists){
//         throw new Error('User not found!');
        
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{author { id name email posts { id title published } } }');

//     return post.author;
// }

// const updatePostForUser = async (postId, data) => {
//     const exists = await prism.exist.Post({
//         id: postId
//     });

//     if (!exists){
//         throw new Error('Post not found');
//     }

//     const post = await prisma.mutation.updatePost({
//         data,
//         where: {
//             id: postId
//         }
//     }, '{author { id name email posts { id title published } } }');

//     return post.author;
// }