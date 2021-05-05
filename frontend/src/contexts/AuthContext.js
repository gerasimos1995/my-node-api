import React, { useReducer } from "react";
import AuthReducer from "../reducers/AuthReducer";

const initialState = {
  currentUser: {
    id: null,
    username: null,
    role: null,
    iat: null,
    exp: null,
  },
  loginStatus: null,
  signupStatus: null,
};

export const AuthContext = React.createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Actions
  function loginUser(user) {
    dispatch({
      type: "LOGIN_USER",
      payload: {
        id: user.id,
        username: user.username,
        role: user.role,
        iat: user.iat,
        exp: user.exp,
      },
    });
  }

  function setUser(user) {
    dispatch({
      type: "SET_USER",
      payload: { ...user },
    });
  }

  const logoutUser = () => {
    dispatch({
      type: "LOGOUT_USER",
    });
  };

  return (
    <AuthContext.Provider
      value={{ currentUser: state.currentUser, loginUser, setUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
