import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      ((state.user = action.payload), (state.isAuthenticated = true));
    },
    logoutUser: (state) => {
      ((state.user = null), (state.isAuthenticated = null));
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
