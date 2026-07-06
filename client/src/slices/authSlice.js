import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      ((state.user = action.payload),
        (state.isAuthenticated = true),
        (state.isInitializing = false));
    },
    logoutUser: (state) => {
      ((state.user = null),
        (state.isAuthenticated = null),
        (state.isInitializing = false));
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
