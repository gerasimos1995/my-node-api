import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "./Navbar";
import Signup from "./Signup";
//import Login from "./Login";
import Login from "./LoginForm";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";

import { AuthProvider } from "../contexts/AuthContext";
import { ProductsProvider } from "../contexts/ProductsContext";

import "../css/App.css";

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact>
              <Homepage />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/logout">
              <Homepage logoutTry={true} />
            </Route>
          </Switch>
        </Router>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
