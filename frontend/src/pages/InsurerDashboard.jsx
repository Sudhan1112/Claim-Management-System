import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaims, updateClaimStatus } from "../redux/slices/claimSlice";

const InsurerDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading, error } = useSelector((state) => state.claim || {});

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  const handleUpdateStatus = async (claimId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this claim?`)) return;

    try {
      // Fixed: Removed undefined data variable, only passing necessary data
      await dispatch(updateClaimStatus({ 
        claimId, 
        status,
        comments: status === "Rejected" ? "Claim rejected by insurer" : "Claim approved by insurer"
      })).unwrap();
      
      dispatch(fetchClaims()); // Refresh list
      alert('Update successful!');
    } catch (error) {
      alert(`Update failed: ${error}`);
    }
  };

  if (loading) return <p>Loading claims...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Claims</h2>
      {claims.length === 0 ? (
        <p>No claims available.</p>
      ) : (
        <ul>
          {claims.map((claim) => (
            <li key={claim._id} className="border p-4 mb-2 rounded shadow">
              <p><strong>Name:</strong> {claim.name}</p>
              <p><strong>Amount:</strong> ${claim.claimAmount}</p>
              <p><strong>Status:</strong> {claim.status}</p>
              <p><strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}</p>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded m-2"
                onClick={() => handleUpdateStatus(claim._id, "Approved")}
                disabled={claim.status === "Approved" || claim.status === "Rejected"}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleUpdateStatus(claim._id, "Rejected")}
                disabled={claim.status === "Approved" || claim.status === "Rejected"}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InsurerDashboard;