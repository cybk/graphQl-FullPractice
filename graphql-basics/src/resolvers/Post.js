const Post = {
    author(parent, args, {db}, info) {
        return db.users.find(elem => elem.id === parent.author);
    },
    comments(parent, args, {db}, info){
        return db.comments.filter(elem => elem.post === parent.id);
    }
}

export {Post as default}