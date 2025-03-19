import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "../lib/scripts/store/store.js";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Slide, ToastContainer} from "react-toastify";
import {AuthWrapper} from "../lib/components/layout/auths.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AuthWrapper>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            closeButton={false}
            transition={Slide}
          />
          <App/>
        </AuthWrapper>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
