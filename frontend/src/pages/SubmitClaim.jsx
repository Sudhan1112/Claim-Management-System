import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitClaim } from "../redux/slices/claimSlice";
import { useNavigate } from "react-router-dom";

const SubmitClaim = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    claimAmount: "",
    description: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert("Only JPG, PNG, or PDF files allowed");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("claimAmount", formData.claimAmount);
    formPayload.append("description", formData.description);
    if (selectedFile) {
      formPayload.append("document", selectedFile);
    }

    try {
      await dispatch(submitClaim(formPayload)).unwrap();
      navigate("/patient-dashboard");
    } catch (error) {
      alert(`Submission failed: ${error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">New Claim Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" 
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          
          <input type="email" name="email" placeholder="Email" 
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>

        <input type="number" name="claimAmount" placeholder="Claim Amount" 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({...formData, claimAmount: e.target.value})} required />

        <textarea name="description" placeholder="Description" rows="4"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({...formData, description: e.target.value})} required />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="cursor-pointer">
            <input type="file" onChange={handleFileChange} 
              className="hidden" accept=".jpg,.jpeg,.png,.pdf" required />
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" 
                stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : "Drag and drop or click to upload document"}
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, or PNG up to 5MB
              </p>
            </div>
          </label>
        </div>

        <button type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default SubmitClaim;