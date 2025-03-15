import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserClaims } from "../redux/slices/claimSlice";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  
  // Get claims and user from Redux store
  const { claims, loading, error } = useSelector((state) => state.claim || {});
  const { user } = useSelector((state) => state.auth || {});

  // Fetch user-specific claims
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from Redux store
        const userId = user?._id;
        
        if (userId) {
          // Call the fetchUserClaims action with the user ID
          await dispatch(fetchUserClaims(userId));
        } else {
          console.error('User ID not available');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    fetchData();
  }, [dispatch, user]);

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error state
  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Claims</h2>
        <Link to="/submit-claim" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          New Claim
        </Link>
      </div>

      {/* Empty state */}
      {claims.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't submitted any claims yet.</p>
          <Link 
            to="/submit-claim" 
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit Your First Claim
          </Link>
        </div>
      )}

      {/* Claims list */}
      {claims.length > 0 && (
        <ul>
          {claims.map((claim) => (
            <li key={claim._id} className="border p-4 mb-2 rounded shadow">
              <p><strong>Amount:</strong> ${claim.claimAmount}</p>
              <p><strong>Status:</strong> {claim.status}</p>
              <p><strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}</p>
              {claim.insurerComments && (
                <p><strong>Comments:</strong> {claim.insurerComments}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDashboard;