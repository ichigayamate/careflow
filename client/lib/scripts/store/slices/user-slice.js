import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {backend} from "../../backend.js";

const initialState = {
  domReady: false,
  user: null,
  token: null,
  isAuthenticated: false,
  justRegistered: false,
};

export const loginUser = createAsyncThunk("user/loginUser", async ({token, loginStatus}, {dispatch}) => {
  localStorage.setItem('token', token);
  dispatch(setToken(token));
  dispatch(authenticateUser(true));
  if(loginStatus === 201) {
    dispatch(setJustRegistered(true))
  }
  return await backend.post(`/users`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => {
    dispatch(setUser(res.data.data));
    return res.data.data;
  });
});

export const checkUser = createAsyncThunk("user/checkUser", async (thunkToken, {dispatch}) => {
  const token = localStorage.getItem("token");
  if (token) {
    return await backend.post("/users", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      dispatch(setToken(token));
      dispatch(setUser(res.data.data));
      dispatch(authenticateUser(true));
      dispatch(setDomReady(true));
      return res.data.data;
    });
  }
  dispatch(setDomReady(true));
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJustRegistered(state, action) {
      state.justRegistered = action.payload;
    },
    setDomReady(state, action) {
      state.domReady = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    clearAuthState(state) {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    authenticateUser(state, action) {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(checkUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const {setJustRegistered, setDomReady, setUser, setToken, clearAuthState, authenticateUser} = userSlice.actions;

export default userSlice.reducer;
