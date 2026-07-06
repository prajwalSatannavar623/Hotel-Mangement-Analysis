import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentResults: [],
};

const currentResultsSlice = createSlice({
  name: "results",
  initialState: initialState,
  reducers: {
    setCurrentresults: (state, action) => {
      state.currentResults = action.payload;
    },
    clearCurrentresults: (state) => {
      state.currentResults = [];
    },
  },
});

export const { setCurrentresults, clearCurrentresults } =
  currentResultsSlice.actions;

export default currentResultsSlice.reducer;
