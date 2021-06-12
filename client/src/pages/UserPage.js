import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useContext } from 'react'
import { Button, Card, Image, Loader, Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/authContext'

import './UserPage.css'

function UserPage(props) {

    const userId = props.match.params.userId

    const { user } = useContext(AuthContext)

    const { data } = useQuery(FETCH_FULL_USER_QUERY, {
        variables: {
            userId
        },
        onError(err) {
            console.log(err.message)
            props.history.push('/NotFound')
        }
    })

    let userMarkup
    if(!data) {
        userMarkup = <Loader active />
    } else {

        const {
            username,
            createdAt,
            email,
            posts
        } = data.getUser


        userMarkup = (
            <div className='user-page'>
                <div className='user-info'>
                    <Image className='user-image' style={{maxWidth: '250px', maxHeight: '250px'}} src='https://react.semantic-ui.com/images/avatar/large/molly.png' circular />
                    <div className='user-details'>
                        <Card fluid >
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>Joined: {new Date(createdAt).toDateString()}</Card.Meta>
                                <Card.Description>Contact : {email}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                    Bio: {username} is a genius scientist very outgoing and always ready to learn somethong new.
                            </Card.Content>
                        </Card>
                    </div>
                </div>
                {user && user.id === userId && (
                    <Button style ={{display: 'block', margin: '10px auto'}} onClick={() => console.log('Edit profile feature to be added...')} primary>Edit Profile</Button>
                )}
                <div style={{marginTop: '30px'}}>
                    <span className="fade-line"></span>
                </div>
                <h1 className='user-page-title'>{username}'s Posts</h1>
                <Transition.Group>
                    {
                        posts && posts.map(post => (
                            <PostCard key={post.id} post={post} userPage={true} />
                        ))
                    }
                </Transition.Group>
            </div>
        )
    }

    return userMarkup
}

const FETCH_FULL_USER_QUERY = gql`
    query ($userId: ID!) {
        getUser (userId: $userId) {
            id
            username
            email
            createdAt
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
`

export default UserPage
