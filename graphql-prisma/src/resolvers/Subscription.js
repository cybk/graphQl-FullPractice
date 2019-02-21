const Subscription = {
    comment: {
        subscribe(parent, {postId}, {prisma}, info){
            return prisma.subscription.comment({
                where: {
                    node: {
                        post:{
                            id: postId
                        }
                    }
                }
            }, info);
        }
    },
    post: {
        subscribe(parent, {postId}, {prisma}, info){
            return prisma.subscription.post({
                where:{
                    node:{
                        published:true
                    }
                }
            }), indo;
        }
    }

}

export {Subscription as default}