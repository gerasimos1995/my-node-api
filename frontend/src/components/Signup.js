import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {

    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const roleRef = useRef();

    const { signup, currentUser, signupError } = useAuth();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault() // page doesn't refresh

        if (passwordConfirmRef.current.value !== passwordRef.current.value){
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(usernameRef.current.value, 
                emailRef.current.value,
                passwordRef.current.value,
                roleRef.current.value)
        } catch (error) {
            setError('Failed to create an account')
        }
        setLoading(false)   
    }

    useEffect(() => {
        console.log(signupError);
        setError(signupError);
    }, [signupError]);

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {currentUser && currentUser.email}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={ handleSubmit }>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" ref={roleRef} required></Form.Control>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? Log In
            </div>
        </>
    )
}
