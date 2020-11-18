import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Login() {

    const usernameRef = useRef()
    const passwordRef = useRef()

    const {login, loginError} = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault() // page doesn't refresh

        try {
            setError('')
            setLoading(true)
            await login(usernameRef.current.value,
                passwordRef.current.value)
        } catch (error) {
            setError('Failed to login user')
        }
        setLoading(false)   
    }

    useEffect(() => {
        console.log(loginError);
        setError(loginError);
    }, [loginError]);

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={ handleLogin }>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Don't have an account? <Link to="/signup">Register</Link>
            </div>
        </>
    )
}
