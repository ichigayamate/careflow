import Input from "../../lib/components/form/input.jsx";
import {Button} from "@material-tailwind/react";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {backend} from "../../lib/scripts/backend.js";
import {toast} from "react-toastify";


export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const {handleSubmit, control} = useForm();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setLoading(true)
    const promise = backend.post("/users/register", data).then(() => {
      navigate("/login");
    }).finally(() => setLoading(false));

    await toast.promise(promise, {
      loading: "Registering...",
      success: "Register success. Please log in using your credentials",
      error: "Register failed"
    })
  }

  return <>
    <h1 className="text-2xl font-bold text-center mb-8">Register to Careflow</h1>
    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-4">
      <Input control={control} name="firstName" label="First name" type="text" required/>
      <Input control={control} name="lastName" label="Last name" type="text" required/>
      <Input control={control} name="dob" label="Date of birth" type="date" required/>
      <Input control={control} name="email" label="Email" type="email" required/>
      <Input control={control} name="password" label="Password" type="password" required/>

      <div className="flex mt-4">
        <Button type="submit" fullWidth disabled={loading}>Register</Button>
      </div>
    </form>
    <div className="mt-4 flex flex-col text-center">
      <p>Already have account? <Link to="/login" className="text-primary-700">Login here</Link></p>
    </div>
  </>
}
