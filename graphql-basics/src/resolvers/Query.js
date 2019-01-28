const Query = {
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
}

export {Query as default}