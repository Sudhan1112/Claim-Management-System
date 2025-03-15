import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Claims Management System</h1>
      <p className="text-lg mb-4">Submit and manage your insurance claims with ease.</p>
      <div className="space-x-4">
        <Link to="/signup" className="bg-blue-500 text-white px-6 py-2 rounded">Signup</Link>
        <Link to="/login" className="bg-gray-500 text-white px-6 py-2 rounded">Login</Link>
      </div>
    </div>
  );
};
export default Homepage;
