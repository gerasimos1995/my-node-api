import React, { useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

import { AuthContext } from "../../contexts/AuthContext";

import {
  Nav,
  NavLink,
  NavMenu,
  Bars,
  NavBtn,
  NavBtnLink,
  NavBtnLink2,
} from "./NavbarElements.js";

import Logo from "../../images/stop-shop.svg";

import "../../css/App.css";

const Navbar = () => {
  const { currentUser, setUser } = useContext(AuthContext);

  const setUserInContext = () => {
    console.log("Trying to set user in Context from Navbar");
    if (
      currentUser.id == null &&
      localStorage.getItem("Access Token") != null
    ) {
      const token = localStorage.getItem("Access Token");
      const decoded = jwtDecode(token);
      console.log("Navbar detected user: ", decoded);
      setUser(decoded);
    }
  };

  useEffect(() => {
    setUserInContext();
  });

  return (
    <>
      <Nav>
        <NavBtnLink2 to="/">
          <img src={Logo} alt="logo" />
        </NavBtnLink2>
        <Bars />
        <NavMenu>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/about">About</NavLink>
          {currentUser.role === "shop_owner" ? (
            <NavLink to="products_list">Products</NavLink>
          ) : (
            <></>
          )}
          {currentUser.role === "shop_owner" || currentUser.role === "user" ? (
            <NavLink to="/contact">Contact us</NavLink>
          ) : (
            <> </>
          )}
          {!currentUser ? <NavLink to="/signup">Register</NavLink> : <></>}
        </NavMenu>
        <NavBtn>
          {currentUser.id != null ? (
            <NavBtnLink to="/logout">Log Out</NavBtnLink>
          ) : (
            <NavBtnLink to="/login">Log In</NavBtnLink>
          )}
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
