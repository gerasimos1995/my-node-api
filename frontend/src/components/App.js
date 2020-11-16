import { Container } from "react-bootstrap"
import Signup from "./Signup"
import Login from "./Login"
import { AuthProvider } from "../contexts/AuthContext"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return ( 
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <Container className="w-100" style={{ maxWIdth: "400px" }}> 
          <Router>
            <AuthProvider>
              <Switch>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
              </Switch>
            </AuthProvider>
          </Router> 
        </Container>
      </Container>
  )
}

export default App;
