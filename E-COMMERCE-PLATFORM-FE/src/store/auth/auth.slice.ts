import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "./auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  /** False until the client has read the cookie on first mount. */
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
};

/**
 * Holds the current session. Reducers stay pure — cookie I/O lives at the
 * boundary (the token util, called from the provider and auth flow).
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
