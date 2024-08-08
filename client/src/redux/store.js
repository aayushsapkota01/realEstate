// Import necessary functions and reducers
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

// Configure and export the Redux store
export const store = configureStore({
  reducer: { user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
