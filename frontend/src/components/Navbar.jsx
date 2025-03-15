import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between">
      <Link to="/" className="text-lg font-bold">Claims Management</Link>
      <div>
        {!token ? (
          <>
            <Link to="/login" className="px-3">Login</Link>
            <Link to="/signup" className="px-3">Signup</Link>
          </>
        ) : (
          <>
            {user?.role === "patient" && <Link to="/patient-dashboard" className="px-3">Dashboard</Link>}
            {user?.role === "insurer" && <Link to="/insurer-dashboard" className="px-3">Dashboard</Link>}
            <button onClick={handleLogout} className="px-3">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
