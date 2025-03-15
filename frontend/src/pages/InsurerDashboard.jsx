import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaims, updateClaimStatus } from "../redux/slices/claimSlice"; // ✅ Import correctly

const InsurerDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading, error } = useSelector((state) => state.claim || {});

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  const handleUpdateStatus = (claimId, status) => {
    const approvedAmount = prompt("Enter approved amount:");
    const comments = prompt("Enter comments:");
    if (approvedAmount && comments) {
      dispatch(updateClaimStatus({ claimId, status, approvedAmount, comments }));
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
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleUpdateStatus(claim._id, "Rejected")}
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
