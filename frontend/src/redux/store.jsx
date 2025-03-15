import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import claimReducer from "../redux/slices/claimSlice";

const store = configureStore({
  reducer: { auth: authReducer, claim: claimReducer },
});

export default store;