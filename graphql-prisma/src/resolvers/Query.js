const Query = {
    users(parent, args, {prisma}, info) {
        const opArgs = {};

        if(args.query) {
            opArgs.where = {
                name_contains: args.query
            }
        }

        return prisma.query.users(opArgs, info);
    },
    posts(parent, args, {prisma}, info){
        return prisma.query.posts(null, info);
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
}

export {Query as default}