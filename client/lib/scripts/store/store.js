import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./slices/user-slice.js";

export default configureStore({
  reducer: {
    user: userSlice
  }
});
