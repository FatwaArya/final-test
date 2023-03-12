import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";

export default configureStore({
  reducer: userReducer,
  devTools: process.env.NODE_ENV !== "production",
});
