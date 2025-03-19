import {useForm} from "react-hook-form";
import Input from "../../lib/components/form/input.jsx";
import {Button} from "@material-tailwind/react";
import {GoogleLogin} from "@react-oauth/google";
import {backend} from "../../lib/scripts/backend.js";
import {useState} from "react";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {loginUser} from "../../lib/scripts/store/slices/user-slice.js";
import {Link} from "react-router";

export default function LoginPage() {
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (data, isGoogle = false) => {
    setLoading(true);
    try {
      const endpoint = isGoogle ? "/users/google" : "/users/login";
      const payload = isGoogle ? {googleToken: data.credential} : data;
      const loginResponse = await backend.post(endpoint, payload);
      const token = loginResponse.data.data.token;

      const resultAction = await dispatch(loginUser({token, loginStatus: loginResponse.status}));

      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        toast.success(`Logged in as ${userData.firstName} ${userData.lastName}`);
      } else if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (response) => handleLogin(response, true);

  return (<>
      <h1 className="text-2xl font-bold text-center mb-8">Login to Careflow</h1>
      <form onSubmit={handleSubmit((data) => handleLogin(data, false))} className="flex flex-col gap-2">
        <Input control={control} name="email" label="Email" type="email" required/>
        <Input control={control} name="password" label="Password" type="password" required/>

        <div className="flex mt-4">
          <Button type="submit" fullWidth disabled={loading}>Login</Button>
        </div>
      </form>
      <hr className="my-4"/>
      <div className="mt-4 flex flex-col text-center">
        <p>Don&apos;t have account?</p>
        <div className="flex justify-center my-2">
          <GoogleLogin onSuccess={handleGoogleLogin}/>
        </div>
        <p>or <Link to="/register" className="text-primary-700">register</Link></p>
      </div>
    </>
  )
}
