import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Redux store configuration
 * Currently only contains auth slice
 * Can be extended with other slices as needed
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

/**
 * RootState type - inferred from store
 * Use this type for useSelector
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch type - inferred from store
 * Use this type for useDispatch
 */
export type AppDispatch = typeof store.dispatch;
