import Signup from "./Signup"
import Login from "./Login"
import Dashboard from './Dashboard'
import { AuthProvider } from "../contexts/AuthContext"
import { ProductsProvider } from '../contexts/ProductsContext'
import '../css/App.css'
import NavBar from './Navbar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
      <AuthProvider>
        <ProductsProvider>
          <Router>
              <NavBar />
              <Switch>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
                <Route path='/dashboard' component={Dashboard}/>
              </Switch>
          </Router>
        </ProductsProvider>
      </AuthProvider>
  )
}

export default App;
