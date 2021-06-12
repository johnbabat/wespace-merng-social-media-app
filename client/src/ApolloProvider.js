// require('dotenv').config()
import React from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'
import { AuthProvider } from './context/authContext'
import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
})
 
let URI
process.env.NODE_ENV === 'development' ? URI = 'http://localhost:5000' : URI = 'https://wespace-merng-social-media-app.herokuapp.com/'

const httpLink = createHttpLink({
    uri: URI
})

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ fragmentMatcher })
})

export default (
    <ApolloProvider client={client}>
        <React.StrictMode>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </React.StrictMode>
        
    </ApolloProvider>
)