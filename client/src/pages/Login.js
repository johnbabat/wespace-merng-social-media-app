import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';
import { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from '../context/authContext'
import { useForm } from '../utils/hooks';

import './Login.css'

function Login({history, setActiveItem}) {

    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = useForm({
        username: '',
        password: '',
    }, loginUserCallback)

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, { data: { login: userData }}) {
            context.login(userData)
            history.push('/')
            setActiveItem('home')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser()
    }
    

    return (
        <div className='form-container'>
            <Form className={`${loading ? 'loading': ''}`} onSubmit={onSubmit} noValidate>
                <h1 className='form-header'>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />
                { errors.username && (
                    <li className='error-message'> {errors.username}</li>
                )}
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />
                { errors.password && (
                    <li className='error-message'> {errors.password}</li>
                )}

                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            { Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                    <ul>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
            </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login (
                username: $username
                password: $password
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Login