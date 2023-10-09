import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice/authSlice";
import { apiSlice } from "../slices/apiSlice/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
