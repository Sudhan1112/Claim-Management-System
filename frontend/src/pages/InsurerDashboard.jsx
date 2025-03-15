import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaims, updateClaimStatus } from "../redux/slices/claimSlice";
import { toast } from "react-hot-toast";

const InsurerDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading, error } = useSelector((state) => state.claim || {});
  const [approvedAmount, setApprovedAmount] = useState({});
  const [comments, setComments] = useState({});
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  const handleUpdateStatus = async (claimId, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this claim?`)) return;

    setProcessing(claimId);
    
    try {
      const payload = { 
        claimId, // This is the ID passed to the API
        status,
        comments: comments[claimId] || 
          (status === "Rejected" ? "Claim rejected by insurer" : "Claim approved by insurer")
      };
      
      // Add approved amount only if approving
      if (status === "Approved") {
        const targetClaim = claims.find(c => c._id === claimId);
        const amount = approvedAmount[claimId] !== undefined ? 
          approvedAmount[claimId] : 
          (targetClaim ? targetClaim.claimAmount : 0);
        
        payload.approvedAmount = Number(amount);
      }
      
      console.log('Sending update payload:', payload);
      
      // Call the API
      await dispatch(updateClaimStatus(payload)).unwrap();
      
      // Refresh claims list
      await dispatch(fetchClaims());
      toast.success(`Claim ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating claim:', error);
      toast.error(`Update failed: ${error}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading && !claims.length) return <p>Loading claims...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Claims</h2>
      
      {claims.length === 0 ? (
        <p>No claims available.</p>
      ) : (
        <ul className="space-y-4">
          {claims.map((claim) => (
            <li key={claim._id} className="border p-4 mb-2 rounded shadow bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> <span className="text-xs">{claim._id}</span></p>
                  <p><strong>Name:</strong> {claim.name}</p>
                  <p><strong>Email:</strong> {claim.email}</p>
                  <p><strong>Amount:</strong> ${claim.claimAmount}</p>
                  <p><strong>Status:</strong> <span className={`font-semibold ${
                    claim.status === "Approved" ? "text-green-600" : 
                    claim.status === "Rejected" ? "text-red-600" : "text-yellow-600"
                  }`}>{claim.status}</span></p>
                  <p><strong>Description:</strong> {claim.description}</p>
                  <p><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleString()}</p>
                  {claim.status !== "Pending" && (
                    <p><strong>Updated:</strong> {new Date(claim.updatedAt).toLocaleString()}</p>
                  )}
                  {claim.approvedAmount > 0 && (
                    <p><strong>Approved Amount:</strong> ${claim.approvedAmount}</p>
                  )}
                  {claim.insurerComments && (
                    <p><strong>Comments:</strong> {claim.insurerComments}</p>
                  )}
                </div>
                
                {claim.status === "Pending" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount to approve:</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        placeholder="Enter amount"
                        defaultValue={claim.claimAmount}
                        onChange={(e) => setApprovedAmount({
                          ...approvedAmount,
                          [claim._id]: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Comments:</label>
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Optional comments"
                        rows="2"
                        onChange={(e) => setComments({
                          ...comments,
                          [claim._id]: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleUpdateStatus(claim._id, "Approved")}
                        disabled={processing === claim._id}
                      >
                        {processing === claim._id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleUpdateStatus(claim._id, "Rejected")}
                        disabled={processing === claim._id}
                      >
                        {processing === claim._id ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {claim.documentUrl && (
                <div className="mt-3">
                  <a
                    href={`https://claim-management-system-4.onrender.com${claim.documentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InsurerDashboard;