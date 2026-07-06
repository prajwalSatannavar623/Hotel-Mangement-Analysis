import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: null,
};

const activeResultSlice = createSlice({
  name: "results",
  initialState: initialState,
  reducers: {
    setActiveResult: (state, action) => {
      state.results = action.payload;
    },
  },
});

export const { setActiveResult } = activeResultSlice.actions;
export default activeResultSlice.reducer;
