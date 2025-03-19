import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {checkUser} from "../../scripts/store/slices/user-slice.js";
import {useNavigate} from "react-router";

export function AuthWrapper({children}) {
  const {domReady} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch, domReady]);

  if (!domReady) return <></>

  return children
}

export function UnauthOnlyWrapper({children}) {
  const {domReady, user} = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [domReady, navigate, user]);

  return domReady && <div
    className="h-screen  bg-gradient-to-bl from-primary-500 to-amber-200 flex items-start justify-center px-8 pt-24">
    <div className="bg-white px-8 py-4 rounded-xl min-w-full lg:min-w-[320px]">
      {children}
    </div>
  </div>
}

export function AuthOnlyWrapper({children}) {
  const {domReady, user} = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [domReady, navigate, user]);

  return domReady && children
}

export function AdminOnlyWrapper({children}) {
  const {domReady, user} = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [domReady, navigate, user]);

  return domReady && children
}
