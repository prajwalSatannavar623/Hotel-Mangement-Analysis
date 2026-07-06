import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "../slices/themeSlice.js";
import authReducer from "../slices/authSlice.js";
import activeResultReducer from "../slices/activeResultSlice.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    results: activeResultReducer,
  },
});
