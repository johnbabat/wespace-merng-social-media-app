import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';
import { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from '../context/authContext';

import { useForm } from '../utils/hooks'

import './Register.css'

function Register({history, setActiveItem}) {

    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }, registerUser)

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register: userData }}) {
            context.login(userData)
            history.push('/')
            setActiveItem('home')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: values
    })

    function registerUser() {
        addUser()
    }

    return (
        <div className='form-container'>
            <Form className={`${loading ? 'loading': ''}`} onSubmit={onSubmit} noValidate>
                <h1 className='form-header'>Register</h1>
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
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    type="email"
                    error={errors.email ? true : false}
                    value={values.email}
                    onChange={onChange}
                />
                { errors.email && (
                    <li className='error-message'> {errors.email}</li>
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
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password.."
                    name="confirmPassword"
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    value={values.confirmPassword}
                    onChange={onChange}
                />
               { errors.confirmPassword && (
                    <li className='error-message'> {errors.confirmPassword}</li>
                )}
                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register (
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
         ) {
             id
             email
             username
             createdAt
             token
            }
    }
`

export default Register