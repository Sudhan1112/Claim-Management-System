import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import InsurerDashboard from "./pages/InsurerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitClaim from "./pages/SubmitClaim";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["insurer"]} />}>
          <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;