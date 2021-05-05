import React, { useContext, useEffect, useCallback, useState } from "react";

import { AuthContext } from "../../contexts/AuthContext";

const Homepage = ({ logoutTry }) => {
  const { logoutUser } = useContext(AuthContext);

  const logout = () => {
    console.log("trying to remove");
    localStorage.removeItem("Access Token");
    logoutUser();
  };

  useEffect(() => {
    if (logoutTry) {
      logout();
    }
  }, []);

  return (
    <>
      <button>Login</button>
      <button>Register</button>
      <p>Details</p>
    </>
  );
};

export default Homepage;
