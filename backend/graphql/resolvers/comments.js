const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Mutation: {
        async createComment(parent, { postId, body }, context) {
            const { username } = checkAuth(context)

            if (!body.trim()) {
                throw new Error('Comment body must not be empty')
            }

            const comment = {
                body,
                username,
                createdAt: new Date().toISOString()
            }

            try {
                post = await Post.findById(postId)
                if (!post) {
                    throw UserInputError('Post not found')
                }
                post.comments.unshift(comment)
                await post.save()

                return post

            } catch (err) {
                throw new Error(err.message)
            }
            
        },

        async deleteComment(parent, { postId, commentId }, context) {
            const { username } = checkAuth(context)

            try {
                post = await Post.findById(postId)
                if (!post) {
                    throw new Error('Post not found')
                }

                const newComments = post.comments.filter(comment => {
                    if (comment._id.toString() === commentId) {
                        if (comment.username !== username) {
                            throw new AuthenticationError('Action not permitted')
                        }
                    }
                    return comment._id.toString() !== commentId
                })
                if (post.comments.length === newComments.length) {
                    throw new Error('Comment not found')
                }
                post.comments = newComments
                await post.save()
                return post

            } catch (err) {
                throw new Error(err.message)
            }
        }
    }
}