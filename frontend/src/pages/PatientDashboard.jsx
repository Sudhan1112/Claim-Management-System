// PatientDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserClaims } from "../redux/slices/claimSlice";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  
  const { claims, loading, error } = useSelector((state) => state.claim || {});
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserClaims(user._id));
    }
  }, [dispatch, user]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colorClass = 
      status === "Approved" ? "bg-green-100 text-green-800 border-green-200" :
      status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" :
      "bg-yellow-100 text-yellow-800 border-yellow-200";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} border`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Claims</h2>
        <Link to="/submit-claim" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          New Claim
        </Link>
      </div>

      {claims.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't submitted any claims yet.</p>
          <Link 
            to="/submit-claim" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit Your First Claim
          </Link>
        </div>
      )}

      {claims.length > 0 && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim._id} className="border p-5 rounded-lg shadow bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">${claim.claimAmount}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(claim.createdAt).toLocaleDateString()} at {new Date(claim.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700">{claim.description}</p>
              </div>
              
              {claim.status === "Approved" && (
                <div className="bg-green-50 p-3 rounded mb-3 border border-green-200">
                  <p><strong>Approved Amount:</strong> ${claim.approvedAmount}</p>
                  <p className="text-sm text-gray-600">
                    Approved on {new Date(claim.updatedAt).toLocaleDateString()} at {new Date(claim.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
              
              {claim.status === "Rejected" && (
                <div className="bg-red-50 p-3 rounded mb-3 border border-red-200">
                  <p className="text-sm text-gray-600">
                    Rejected on {new Date(claim.updatedAt).toLocaleDateString()} at {new Date(claim.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
              
              {claim.insurerComments && (
                <div className="border-t pt-3 mt-3">
                  <p><strong>Insurer Comments:</strong></p>
                  <p className="text-gray-700">{claim.insurerComments}</p>
                </div>
              )}
              
              {claim.documentUrl && (
                <div className="mt-3">
                  <a 
                    href={`https://claim-management-system-4.onrender.com${claim.documentUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Uploaded Document
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;