const users = [
    {
        id: '1',
        name: 'Juan',
        email: 'Juan@fake.com',
        age: 20
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'Sarah@fake.com',
        age: 25
    },
    {
        id: '3',
        name: 'Mike',
        email: 'Mike@fake.com',
        age: 18
    }
]

const posts = [
    {
        id:'1',
        title: 'first title',
        body: 'Just a initial post for testing',
        published: true,
        author: '1'
    },
    {
        id:'2',
        title: 'second title',
        body: 'scond post used for demo',
        published: false,
        author:'1'
    },
    {
        id:'3',
        title: 'a post',
        body: 'Amlo is a looser',
        published: true,
        author:'3'
    },
    {
        id:'4',
        title: 'draft',
        body: 'this post was never published',
        published: false,
        author: '2'
    }
]

const comments = [
    {
        id: '1',
        text: 'First comment',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Second comment',
        author: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'Third comment',
        author: '2',
        post: '4'
    },
    {
        id: '3',
        text: 'forth comment',
        author: '3',
        post: '2'
    }
]

const db = {
    users,
    posts,
    comments
}

export {db as default}
