import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EnrollmentForm from "./pages/EnrollmentForm";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/enroll" element={<EnrollmentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
