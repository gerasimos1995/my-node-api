import React, { useContext, useEffect } from 'react'
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from './NavbarElements.js'
import Logo from '../../images/stop-shop.svg'
import '../../css/App.css'
import { AuthContext } from '../../contexts/AuthContext'
import jwtDecode from 'jwt-decode'

const Navbar = () => {
    const { currentUser, setUser } = useContext(AuthContext)
    
    function setUserInContext(){
        if ((currentUser.id == null) && (localStorage.getItem('Access Token') != null)){
            const token = localStorage.getItem('Access Token')
            const decoded = jwtDecode(token)
            setUser(decoded)
        }
    }

    useEffect(() => {
        setUserInContext()
    }, [])

    return (
        <>
            <Nav>
                <NavLink to='/'>
                    <img src={Logo} alt='logo'/>
                </NavLink>
                <Bars/>
                <NavMenu> 
                    <NavLink to="/about">About</NavLink>
                    {currentUser.role == "shop_owner" ? <NavLink to="products_list">Products</NavLink> : <NavLink to="/services">Services</NavLink>}
                    <NavLink to="/contact">Contact us</NavLink>
                    <NavLink to="/signup">Register</NavLink>
                </NavMenu>
                <NavBtn>
                    {currentUser.id != null ? <NavBtnLink to="/logout">Log Out</NavBtnLink> : <NavBtnLink to="/login">Log In</NavBtnLink>}
                </NavBtn>
            </Nav>
        </>
    )
}

export default Navbar;