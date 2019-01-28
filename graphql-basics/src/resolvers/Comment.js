const Comment = {
    author(parent, args, {db}, info){
        return db.users.find(elem => elem.id === parent.author);
    },
    post(parent, args, {db}, ingo){
        return db.posts.find(elem => elem.id === parent.post);
    }
}

export {Comment as default}