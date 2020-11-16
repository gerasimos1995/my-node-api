import React, { useContext, useState } from 'react'
import axios from 'axios'
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser ] = useState()
    const [signupError, setSignupError] = useState()


    function signup(username, email, password, role) {
        axios.post("http://localhost:3000/api/auth/register", {
            username: username,
            password: password,
            email: email,
            role: role
        }).then((res) => {
            console.log(res.data);
            setCurrentUser(res.data);
        }).catch((error) => {
            if (error.response){
                var msg = error.response.data.message
                console.log(msg);
                if (msg === "User already exists"){
                    setSignupError("User already exists");
                } else if (msg === "Username already in use"){
                    setSignupError("Username already in use");
                }else{
                    // that means that data validation failed so display corresponding error
                    msg = msg.replace(/\"/g,'');
                    msg = msg.replace(/"/g,'');
                    setSignupError(msg);
                } 
            } else if (error.request){
                console.log("Did not make the request");
                setSignupError("Something went wrong with the request");
            } else {
                console.log(error);
                setSignupError("Unexpected error");
            }
        });
    }

    const value = { 
        currentUser,
        signup,
        signupError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
