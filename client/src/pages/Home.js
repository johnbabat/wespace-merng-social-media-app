import { useQuery } from '@apollo/react-hooks'
import { useContext } from 'react';
import { Loader, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/authContext';
import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql'
import PostForm from '../components/PostForm';

import './Home.css'


function Home() {

    const {
        loading,
        data: {getPosts: posts } = {}
    } = useQuery(FETCH_POSTS_QUERY);

    const { user } = useContext(AuthContext)

    return (
        <div>
            {user && (
                <PostForm />
            )}
            <h1 className='page-title'>Recent Posts</h1>
            {loading ? (
                <Loader active />
            ) : (
                <Transition.Group>
                    {
                        posts && posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    }
                </Transition.Group>
            )}
        </div>
    )
}

export default Home
