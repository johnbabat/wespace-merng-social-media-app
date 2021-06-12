import moment from 'moment'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react'
import { AuthContext } from '../context/authContext'
import DeleteButton from './DeleteButton'
import LikeButton from './LikeButton'

import './PostCard.css'

function PostCard({ post: {id, body, createdAt, username, userId, likeCount, likes, commentCount, comments}, userPage }) {

    const { user } = useContext(AuthContext)

    return (
        <Card.Group>
            <Card style={{width: '700px', margin: '12.50px auto'}}>
                <Card.Content className='post-content'>
                <Image
                    as={Link}
                    to={`/user/${userId}`}
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                />
                <Card.Header className='post-user'><a href={`/user/${userId}`}>{ username }</a></Card.Header>
                <Card.Meta>{ moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description className='post-text' as={Link} to={`/post/${id}`} >{ body }</Card.Description>
                </Card.Content>
                <Card.Content extra>
                <LikeButton user={user} post={{id, likes, likeCount}} />
                <Popup
                    content='Comment on post'
                    inverted
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/post/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }/>
                
                {user && user.username === username && (
                    userPage ? <DeleteButton postId={id} userId={userId} /> : <DeleteButton postId={id} />
                )}
                </Card.Content>
            </Card>
        </Card.Group>
    )
}

export default PostCard