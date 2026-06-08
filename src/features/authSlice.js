import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    user_id: "",
    full_name: "null",
    email: null,
    phone_number: null,
    user_initials: null,
    is_rider: false,
    is_driver: false,
  },
  access: null,
  refresh: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        user_id,
        full_name,
        email,
        phone_number,
        user_initials,
        is_rider,
        is_driver,
        tokens,
      } = action.payload;
 
      if (!state.user) {
        state.user = {};
      }

      state.user.user_id = user_id || "";
      state.user.full_name = full_name || "";
      state.user.email = email || null;
      state.user.phone_number = phone_number || null;
      state.user.user_initials = user_initials || null;
      state.user.is_rider = is_rider || false;
      state.user.is_driver = is_driver || false;

      if (tokens) {
        state.access = tokens.access || null;
        state.refresh = tokens.refresh || null;
      }

      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.access = null;
      state.refresh = null;
      state.user = {
        user_id: "",
        full_name: null,
        email: null,
        phone_number: null,
        user_initials: null,
        is_rider: false,
        is_driver: false,
      };
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;