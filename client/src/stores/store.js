import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "../slices/authSlice.js";
import authReducer from "../slices/authSlice.js";
import currentResultsReducer from "../slices/currentResultSlice.js";
import historyReducer from "../slices/historySlice.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    currentResults: currentResultsReducer,
    history: historyReducer,
  },
});
