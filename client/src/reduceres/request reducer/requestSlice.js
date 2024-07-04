// requestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestService from "./requestService";

const initialState = {
  requests: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getRequest = createAsyncThunk(
  "request/getRequest",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await requestService.getRequest(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = requestSlice.actions;
export default requestSlice.reducer;
