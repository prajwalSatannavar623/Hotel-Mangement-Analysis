import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
  }
  return "light";
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";

      // sync to local storage
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("theme", state.theme);
      }
    },
    // not used right now
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("theme", action.payload);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
