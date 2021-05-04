import React, { useRef, useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function Login() {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();

  //, updateLoginStatus, loginStatus
  const { loginUser } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); // page doesn't refresh

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
      };

      const result = await axios.post(
        "http://localhost:3000/api/auth/login",
        postData,
        headers
      );
      //console.log("Login attempt: ", result);

      var decoded_access = jwtDecode(result.data.AccessToken);
      loginUser(decoded_access);

      localStorage.setItem("Access Token", `Bearer ${result.data.AccessToken}`);

      localStorage.setItem(
        "Refresh Token",
        `Bearer ${result.data.RefreshToken}`
      );

      setLoading(false);
      history.push("/dashboard");
    } catch (error) {
      if (error.response) {
        var msg = error.response.data.message;
        console.log(msg);
        if (msg === "User doesn't exist") {
          setError("User doesn't exist");
        } else if (msg === "Incorrect Password") {
          setError("Incorrect Password");
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
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                ref={usernameRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
              ></Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup">Register</Link>
      </div>
    </>
  );
}
