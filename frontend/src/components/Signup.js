import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const history = useHistory();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const roleRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // page doesn't refresh

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };

      const postData = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        role: roleRef.current.value,
      };

      const result = await axios.post(
        "http://localhost:3000/api/auth/register",
        postData,
        headers
      );
      console.log(result);
      setLoading(false);
      if (result && result.status === parseInt("201")) history.push("/login");
    } catch (error) {
      if (error.response) {
        var msg = error.response.data.message;
        if (msg === "User already exists") {
          setError("User already exists");
        } else if (msg === "Username already in use") {
          setError("Username already in use");
        } else {
          // that means that data validation failed so display corresponding error
          setError(msg);
        }
      } else if (error.request) {
        console.log("Did not make the request");
        setError("Something went wrong with the request");
      } else {
        console.log(error);
        setError("Unexpected error");
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* {returnMessage && <Alert variant="success">{returnMessage}</Alert>} */}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                ref={usernameRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="role">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" ref={roleRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
