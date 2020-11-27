import React, { useReducer } from 'react'
import AuthReducer from '../reducers/AuthReducer'

const initialState = {
    currentUser: {
        id: null,
        username: null,
        role: null,
        iat: null,
        exp: null
    },
    loginStatus: null,
    signupStatus: null
}
// }username: "test2", role: "client", id: "5fb51fdf20fbf54b48c725d4", iat: 1606345626, exp: 1606345686


export const AuthContext = React.createContext(initialState)

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // Actions
    function loginUser (user) {
        dispatch({
            type: 'LOGIN_USER',
            payload: {
                id: user.id,
                username: user.username,
                role: user.role,
                iat: user.iat,
                exp: user.exp
            }
        })
    }

    // function updateLoginStatus (status) {
    //     console.log("Received: ", status)
    //     dispatch({
    //         type: 'UPDATE_LOGIN_FAILED',
    //         payload: {
    //             message: status
    //         }
    //     })
    // }

    // function updateSignupStatus (status) {
    //     dispatch({
    //         type: 'UPDATE_STATUS_FAILED',
    //         payload: {
    //             message: status
    //         }
    //     })
    // }

    return (
        <AuthContext.Provider value={{
            currentUser: state.currentUser,
            // loginStatus: state.loginStatus,
            // signupStatus: state.signupStatus,
            loginUser
            // updateLoginStatus,
            // updateSignupStatus
        }}>
            {children}
        </AuthContext.Provider>
    )
}
