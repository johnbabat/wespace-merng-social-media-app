import { useContext } from "react";
import { Redirect, Route} from "react-router-dom";
import { AuthContext } from "../context/authContext";
import jwtDecode from 'jwt-decode';

export const AuthRoute = ({ component: Component, ...rest}) => {
    const {user } = useContext(AuthContext)

    return (
            <Route
                {...rest}
                render={props =>
                    user ? <Redirect to='/'/> : <Component {...props} />
                }
            />
    )
}

export const checkUser = () => {
    if (localStorage.getItem('jwtToken')) {
        const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))
        if (decodedToken.exp * 1000 > Date.now()) {
            return true
    }}
    return false
}