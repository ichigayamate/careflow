import {Button, Dialog, DialogBody, DialogFooter, DialogHeader} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import Input from "../../lib/components/form/input.jsx";
import {backend} from "../../lib/scripts/backend.js";
import {toast} from "react-toastify";
import {Link} from "react-router";

export default function IndexPage() {
  const {control, handleSubmit} = useForm();
  const {user, justRegistered, token} = useSelector((state) => state.user);
  const [dobModal, setDobModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const handleDobModal = () => setDobModal(!dobModal);

  useEffect(() => {
    if (justRegistered) {
      setDobModal(true);
    }
  }, [justRegistered]);

  const handleSetDob = async (data) => {
    setModalLoading(true);
    await backend.put(`/users/${user.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      setDobModal(false);
    }).catch(e => {
      toast.error(e.response.data.message);
    }).finally(() => {
      setModalLoading(false);
    });
  }

  return (<>
      <div className="-m-4 bg-primary-800 text-white relative h-screen flex flex-col items-center justify-center">
        <h1 className="mb-4 font-bold text-4xl">Welcome to careflow</h1>
        <p>One stop solution for your health</p>
        <div className="flex gap-4 mt-4">
          <Link to="/shop">
            <Button>Start shopping</Button>
          </Link>
        </div>
      </div>

      <Dialog open={dobModal} handler={handleDobModal} dismiss={{
        enabled: false
      }}>
        <DialogHeader>Welcome to Careflow</DialogHeader>
        <form onSubmit={handleSubmit(handleSetDob)}>
          <DialogBody>
            <p className="mb-2">Please set date of birth before continue</p>
            <Input type="date" required control={control} name="dob" label="Date of birth"/>
          </DialogBody>
          <DialogFooter>
            <Button variant="gradient" color="green" type="submit" loading={modalLoading}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
