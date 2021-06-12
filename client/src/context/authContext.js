import { createContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken')
    } else {
        initialState.user = decodedToken
    }
}

export const AuthContext = createContext({
    user: null,
    login: (data) => {},
    logout: () => {}
})

export const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem('jwtToken', userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout() {
        localStorage.removeItem('jwtToken')
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <AuthContext.Provider 
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}