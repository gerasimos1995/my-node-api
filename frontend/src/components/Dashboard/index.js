import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const Dashboard = () => {

    const { currentUser } = useContext(AuthContext)
    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    return (
        <h1>
            {JSON.stringify(currentUser)}
        </h1>
    )
}

export default Dashboard
