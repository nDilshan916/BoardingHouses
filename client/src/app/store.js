import { configureStore } from "@reduxjs/toolkit";
import requestReducer from "../reduceres/request reducer/requestSlice";

const store = configureStore({
  reducer: {
    request: requestReducer,
  },
});
export default store;
