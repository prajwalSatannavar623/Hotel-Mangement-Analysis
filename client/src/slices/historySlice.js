import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

const historySlice = createSlice({
  name: "history",
  initialState: initialState,
  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { setHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
