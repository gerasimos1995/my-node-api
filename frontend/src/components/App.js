import { Container } from "react-bootstrap";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <Container className="w-100" style={{ maxWIdth: "400px" }}> 
          <Signup/>
        </Container>
      </Container>
    </AuthProvider>
  )
}

export default App;
