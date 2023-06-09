import axios from "axios";
import Cookies from "js-cookie";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
const BASE_URl = "http://localhost:3000";

export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${BASE_URl}/users/login`, data);
    Cookies.set("token", response.data.token, { expires: 1 });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk(
  "users/register",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URl}/users`, data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "users/logout",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URl}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      Cookies.remove("token");
      return "logout success";
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loading: false,
  userInfo: Cookies.get("token") ? jwt_decode(Cookies.get("token")) : null,
  userToken: Cookies.get("token") ? Cookies.get("token") : null,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError(state, action) {
      state.error = null;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.user;
      state.userToken = action.payload.token;
      state.success = true;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.user;
      state.userToken = action.payload.token;
      Cookies.set("token", action.payload.token, { expires: 1 });
      state.success = true;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [logout.pending]: (state, action) => {
      state.loading = true;
    },
    [logout.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;

      state.success = true;
    },
    [logout.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
