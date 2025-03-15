import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaims } from "../redux/slices/claimSlice";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading, error } = useSelector((state) => state.claim || {}); // Ensure state is available

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  if (loading) return <p>Loading claims...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Claims</h2>
        <Link to="/submit-claim" className="bg-blue-500 text-white px-4 py-2 rounded">
          New Claim
        </Link>
      </div>
      {claims.length === 0 ? (
        <p>No claims submitted yet.</p>
      ) : (
        <ul>
          {claims.map((claim) => (
            <li key={claim._id} className="border p-4 mb-2 rounded shadow">
              <p><strong>Amount:</strong> ${claim.claimAmount}</p>
              <p><strong>Status:</strong> {claim.status}</p>
              <p><strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDashboard;