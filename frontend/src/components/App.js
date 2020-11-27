import Signup from "./Signup"
import Login from "./Login"
import Dashboard from './Dashboard'
import { AuthProvider } from "../contexts/AuthContext"

import '../css/App.css'
import NavBar from './Navbar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return ( 
      // <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      //   <Container className="w-100" style={{ maxWIdth: "400px" }}> 
      //     <Router>
      //       <AuthProvider>
      //         <Switch>
      //           <Route path="/signup" component={Signup}/>
      //           <Route path="/login" component={Login}/>
      //         </Switch>
      //       </AuthProvider>
      //     </Router> 
      //   </Container>
      // </Container>
      <AuthProvider>
        <Router>
            <NavBar />
            <Switch>
              <Route path="/signup" component={Signup}/>
              <Route path="/login" component={Login}/>
              <Route path='/dashboard' component={Dashboard}/>
            </Switch>
        </Router>
      </AuthProvider>
  )
}

export default App;
