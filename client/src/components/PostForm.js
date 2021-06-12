import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import _ from 'lodash';

import { AuthContext } from '../context/authContext';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { useForm } from '../utils/hooks';

import './PostForm.css'

function PostForm() {

    const { user } = useContext(AuthContext)

    const [postError, setPostError] = useState('')

    const { values, onChange, onSubmit } = useForm({
        body: ''
    }, createPostCallback)

    const [ createPost ] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = _.cloneDeep(proxy.readQuery({
                query: FETCH_POSTS_QUERY
            }))
            data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
            values.body = ''
        },
        onError(err) {
            setPostError(err.graphQLErrors[0].extensions.exception.stacktrace[0].replace('Error: ', ''))
        }
    })

    function createPostCallback() {
        createPost()
    }

    return (
        <div className='make-post' >
            <Form onSubmit={onSubmit}>
                <h2>Hi {user.username},<br/>What's on your mind:</h2>
                <Form.Field>
                    <Form.TextArea
                        rows='1'
                        placeholder="Hi World!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={postError ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Post
                    </Button>
                </Form.Field>
            </Form>
            {postError && (
                <div className='ui error message'>
                    <ul className='list'>
                        <li>{postError}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $body: String!
    ) {
        createPost (
            body: $body 
        ) {
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
`

export default PostForm
