const gql = require('graphql-tag');

module.exports = gql`
type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
    userId: ID
}

type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    posts: [Post]
}

type Comment {
    id: ID!
    username: String!
    createdAt: String!
    body: String!
}

type Like {
    id: ID!
    username: String!
    createdAt: String!
}

input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}

type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUser(userId: ID!): User
}

union UserOrPost = Post | User

type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!, userId: ID): UserOrPost!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!    
    toggleLikePost(postId: ID!): Post!
}

type Subscription {
    newPost: Post!
}
`