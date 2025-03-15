import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';  // Fixed path
import claimReducer from '../redux/slices/claimSlice';
import { logout } from '../redux/slices/authSlice';

const errorMiddleware = store => next => action => {
  if (action?.error?.message?.includes(401)) {
    store.dispatch(logout());
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    claim: claimReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware)
});

export default store;