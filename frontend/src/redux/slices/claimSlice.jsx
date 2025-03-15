import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Use consistent API instance - using the api from utils/api instead of axios directly
export const fetchClaims = createAsyncThunk(
  "claims/fetchClaims",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/claims/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch claims");
    }
  }
);

export const fetchUserClaims = createAsyncThunk(
  "claims/fetchUserClaims",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/claims/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user claims");
    }
  }
);

export const submitClaim = createAsyncThunk(
  "claims/submitClaim",
  async (formData, { rejectWithValue }) => {
    try {
      // Using api instance that already has the token handling
      const response = await api.post("/claims/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
          // Token will be added by interceptor
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit claim");
    }
  }
);

// Fixed: Using consistent API import and correct URL format
export const updateClaimStatus = createAsyncThunk(
  "claims/updateClaimStatus", 
  async ({ claimId, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/claims/${claimId}`, 
        data
        // Token will be added by interceptor
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
  reducers: {
    clearClaimErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all claims
      .addCase(fetchClaims.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload;
        state.error = null;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch claims";
      })
      
      // Fetch user claims
      .addCase(fetchUserClaims.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchUserClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload;
        state.error = null;
      })
      .addCase(fetchUserClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user claims";
      })
      
      // Submit claim
      .addCase(submitClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitClaim.fulfilled, (state, action) => { 
        state.loading = false;
        state.claims.push(action.payload);
        state.error = null;
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit claim";
      })
      
      // Update claim status
      .addCase(updateClaimStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = state.claims.map(claim => 
          claim._id === action.payload._id ? action.payload : claim
        );
        state.error = null;
      })
      .addCase(updateClaimStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update claim";
      });
  },
});

export const { clearClaimErrors } = claimSlice.actions;
export default claimSlice.reducer;