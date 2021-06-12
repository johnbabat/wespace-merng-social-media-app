import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'

import './LikeButton.css'

function LikeButton({post: {id, likeCount, likes}, user}) {
    
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }, [user, likes]);

    const [ toggleLike ] = useMutation(TOGGLE_LIKE_POST, {
        variables: {postId: id},
        onError(err) {
            console.log(err.message)
        }
        
    })

    const likeButton = user ? (
        liked ? (
            <Button color='teal' >
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic >
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button color='teal' basic as={Link} to='/login' >
            <Icon name='heart' />
        </Button>
    )

    const likePost = () => {
        toggleLike()
    }

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            <Popup
                content={liked ? 'Unlike' : 'Like'}
                inverted
                trigger={ likeButton }
                />
            
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const TOGGLE_LIKE_POST = gql`
    mutation toggleLikePost(
        $postId: ID!
    ) {
        toggleLikePost (
            postId: $postId 
        ) {
            id
            likes {
                id
                username
                createdAt
            }
            likeCount
        }
}
`


export default LikeButton