import React, { useState } from 'react';
import api from '../utils/api';

const ClaimDebugTool = () => {
  const [claimId, setClaimId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testClaimFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/claims/debug/${claimId}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const testClaimUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/claims/${claimId}`, {
        status: 'Approved',
        approvedAmount: 100,
        comments: 'Debug test approval'
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Claim Debug Tool</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Claim ID:</label>
        <input 
          type="text" 
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter claim ID"
        />
      </div>
      
      <div className="flex space-x-2 mb-6">
        <button
          onClick={testClaimFetch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Test Fetch
        </button>
        
        <button
          onClick={testClaimUpdate}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
        >
          Test Update
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="font-bold text-red-700">Error:</h3>
          <pre className="whitespace-pre-wrap text-red-600">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-700">Result:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ClaimDebugTool;