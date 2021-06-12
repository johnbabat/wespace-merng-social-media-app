import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'
import _ from 'lodash';

import { FETCH_POSTS_QUERY } from '../utils/graphql'

import './DeleteButton.css'

function DeleteButton({postId, userId, commentId, callback}) {

    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [ deletePostOrComment ] = useMutation(mutation, {
        variables: {
            postId,
            userId,
            commentId
        },
        update(proxy) {
            setConfirmOpen(false)
            if (!commentId && !userId ) {
                const data = _.cloneDeep(proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                }))
                data.getPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            }
            if (callback) callback();
        },
        onError(err) {
            console.log(err.message)
        }
    })

    return (
        <>
        <Popup
            content={commentId ? 'Delete comment' : 'Delete post'}
            inverted
            trigger={
                <Button
                    className='post-or-comment-delete-btn'
                    as='div'
                    color='red'
                    floated='right'
                    onClick={() => setConfirmOpen(true)}
                    style={{padding:'11px'}}>
                    <Icon name='trash' style={{ margin: 0 }} />
                </Button>
            }/>        
        <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePostOrComment}
        />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost ($postId: ID!, $userId: ID) {
        deletePost (postId: $postId, userId: $userId) {
            ...on User {
                id
                posts {
                    id
                    body
                    createdAt
                    username
                    likes {
                        id
                        username
                        createdAt
                    }
                    likeCount
                    comments {
                        id
                        body
                        username
                        createdAt
                    }
                    commentCount
                    userId
                }
            }
        }
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment (
        $postId: ID!,
        $commentId: ID!
    ) {
        deleteComment (
            postId: $postId ,
            commentId: $commentId
        ) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    } 
`

export default DeleteButton
