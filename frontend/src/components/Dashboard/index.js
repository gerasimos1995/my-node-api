import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import ProductForm from '../ProductForm'
import ProductsList from '../ProductsList'

const Dashboard = () => {

    const { currentUser } = useContext(AuthContext)
    
    return (
        <>
            <ProductForm/>
            <ProductsList />
        </>
    )
}

export default Dashboard
