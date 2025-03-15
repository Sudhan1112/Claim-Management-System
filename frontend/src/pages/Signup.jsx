import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as yup from "yup";

// Validation schema
const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().oneOf(["patient", "insurer"], "Invalid role")
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient"
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await signupSchema.validate(formData, { abortEarly: false });
      
      const result = await dispatch(signupUser(formData));
      
      if (signupUser.fulfilled.match(result)) {
        toast.success("Registration successful!");
        navigate(result.payload.user.role === "patient" 
          ? "/patient-dashboard" 
          : "/insurer-dashboard"
        );
      }
      
      if (signupUser.rejected.match(result)) {
        toast.error(result.payload || "Registration failed");
      }
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : ""}`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Role Selection */}
        <div>
          <select
            name="role"
            className={`w-full p-2 border rounded ${errors.role ? "border-red-500" : ""}`}
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="patient">Patient</option>
            <option value="insurer">Insurer</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;