const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentResolvers = require('./comments')

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    UserOrPost: {
        ...postsResolvers.UserOrPost
    },
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
        ...commentResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}