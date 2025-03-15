import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/claims";

// ✅ Fetch all claims
export const fetchClaims = createAsyncThunk("claims/fetchClaims", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch claims");
  }
});

// ✅ Submit a claim
export const submitClaim = createAsyncThunk(
  "claims/submitClaim",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit claim");
    }
  }
);

//Update claim status
export const updateClaimStatus = createAsyncThunk(
  "claims/updateClaimStatus", 
  async ({ claimId, ...data }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${API_URL}/update/${claimId}`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${auth.token}` //Add auth header
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update claim");
    }
  }
);

const claimSlice = createSlice({
  name: "claim",
  initialState: { claims: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => { state.loading = true; })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitClaim.fulfilled, (state, action) => { state.claims.push(action.payload); })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        state.claims = state.claims.map(claim => claim._id === action.payload._id ? action.payload : claim);
      });
  },
});

export default claimSlice.reducer;