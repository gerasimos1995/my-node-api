import React, { useContext } from 'react'
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from './NavbarElements.js'
import Logo from '../../images/stop-shop.svg'
import '../../css/App.css'
import { AuthContext } from '../../contexts/AuthContext'

const Navbar = () => {
    const { currentUser } = useContext(AuthContext)
    // const imgStyle = {
    //     max-width: "50px",
    //     max-height: "50px"
    // }
    return (
        <>
            <Nav>
                <NavLink to='/'>
                    {/* <img src={require('../../images/stop-shop.svg')} alt='logo' /> */}
                    <img src={Logo} alt='logo'/>
                </NavLink>
                {/* {currentUser} */}
                <Bars/>
                {/* activeStyle */}
                <NavMenu> 
                    <NavLink to="/about">
                        About
                    </NavLink>
                    <NavLink to="/services">
                        Services
                    </NavLink>
                    <NavLink to="/contact">
                        Contact us
                    </NavLink>
                    <NavLink to="/signup">
                        Register
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/login">Log In</NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    )
}

export default Navbar;