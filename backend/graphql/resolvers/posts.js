const { AuthenticationError } = require('apollo-server-errors');
const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    UserOrPost: {
        __resolveType(obj, context, info){
          if (obj.body) {
            return 'Post';
          }
          if (obj.email) {
            return 'User';
          }
          return null; // GraphQLError is thrown
        }
      },
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(parent, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err)
            }
        }        
    },

    Mutation: {
        async createPost(parent, { body }, context) {
            const user = checkAuth(context)

            if (!body.trim()) {
                throw new Error('Post body must not be empty')
            }

            userRecord = await User.findById(user.id)

            const newPost = new Post ({
                body,
                userId: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save()

            userRecord.posts.unshift(post)

            await userRecord.save()

            context.pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post
        },
        
        async deletePost(parent, { postId, userId }, context) {
            const user = checkAuth(context)

            userRecord = await User.findById(user.id).populate('posts')

            try {
                const post = await Post.findById(postId)
                if (!post) {
                    throw new Error('Post not found')
                }

                if (post.username !== user.username) {
                    throw new AuthenticationError('Action not permitted');
                }

                post.delete();
                if (userId) {
                    userRecord.posts = userRecord.posts.filter(post => post.id !== postId)
                    await userRecord.save()
                    return userRecord
                }
                return post

            } catch (err) {
                throw new Error(err)
            }
        },

        async toggleLikePost(parent, { postId }, context) {
            const { username } = checkAuth(context)

            const like = {
                username,
                createdAt: new Date().toISOString()
            }

            try {
                post = await Post.findById(postId)
                if (!post) {
                    throw new Error('Post not found')
                }
                const hasLiked = post.likes.findIndex(like => like.username === username)

                if (hasLiked >= 0) {
                    post.likes.splice(hasLiked, 1)
                } else {
                    post.likes.push(like)
                }
                post.save()

                return post
                
            } catch (err) {
                throw new Error(err.message)
            }
        }
    },

    Subscription: {
        newPost: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}