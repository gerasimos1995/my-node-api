export default (state, action) => {
    switch(action.type){
        case 'LOGIN_USER':
            return {
                ...state,
                currentUser: {
                    id: action.payload.id,
                    username: action.payload.username,
                    role: action.payload.role,
                    iat: action.payload.iat,
                    exp: action.payload.exp
                },
                loginStatus: null
            }
        case 'SET_USER': 
            return {
                ...state,
                currentUser: {
                    id: action.payload.id,
                    username: action.payload.username,
                    role: action.payload.role
                }
            }
        case 'UPDATE_LOGIN_FAILED':
            console.log("Received2: ", action.payload.message)
            return {
                ...state,
                currentUser: {
                    id: null,
                    username: null,
                    role: null,
                    iat: null,
                    exp: null
                },
                loginStatus: action.payload.message
            }
        case 'UPDATE_SIGNUP_FAILED':
            return {
                ...state,
                currentUser: {
                    id: null,
                    username: null,
                    role: null,
                    iat: null,
                    exp: null
                },
                signupStatus: action.payload.message
            }
        default:
            return state;
    }
}

// currentUser: {
//     id: null,
//     username: null,
//     role: null,
//     iat: null,
//     exp: null
// }