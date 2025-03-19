import {
  Navbar as MTNavbar,
  Button,
  IconButton,
  Typography,
  Collapse,
  Dialog, DialogBody, DialogFooter
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthState} from "../scripts/store/slices/user-slice.js";

const navlist = (
  <>
    <Typography
      as="li"
      variant="small"
      color="blue-gray"
      className="p-1 font-normal"
    >
      <Link to="/shop" className="flex items-center">
        Shop
      </Link>
    </Typography>
  </>
);

export default function Navbar() {
  const [logoutModal, setLogoutModal] = useState(false);
  const handleLogoutModal = () => setLogoutModal(!logoutModal);
  const [openNav, setOpenNav] = useState(false);
  const {user} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );

    return () => {
      window.removeEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }
  }, []);

  const handleLogout = () => {
    dispatch(clearAuthState());
    handleLogoutModal();
  }

  return (<>
    <MTNavbar
      className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 bg-primary-500/60 backdrop-blur-lg border-0">
      <div className="flex items-center justify-between text-secondary-900">
        <Link to="/">
          <Typography
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            Careflow
          </Typography>
        </Link>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">
            <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navlist}
              {user?.role === "admin" && (
                <Typography
                  as="li"
                  variant="small"
                  color="blue-gray"
                  className="p-1 font-normal"
                >
                  <Link to="/cms" className="flex items-center">
                    Access CMS
                  </Link>
                </Typography>
              )}
            </ul>
          </div>
          <div className="flex items-center gap-x-1">
            {user ? (
              <div className="border-l border-neutral-300 pl-8 flex items-center">
                <Typography
                  className="mr-4 py-1.5 text-sm font-medium hidden lg:inline-block"
                >
                  Welcome, {user.firstName} {user.lastName}
                </Typography>
                <Button variant="text" size="sm" onClick={handleLogoutModal} className="hidden lg:inline-block">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block"
                >
                  <span>Log In</span>
                </Button>
              </Link>
            )}
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        <ul className="mt-2 mb-4 flex flex-col gap-2">
          {navlist}
        </ul>
        <div className="flex items-center gap-x-1">
          {user ? (
            <div className="border-t w-full flex justify-between pt-2 text-secondary-900">
              <Typography
                className="mr-4 py-1.5 text-sm font-medium"
              >
                Welcome, {user.firstName} {user.lastName}
              </Typography>
              <Button variant="text" size="sm" onClick={handleLogoutModal}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                variant="text"
                size="sm"
              >
                <span>Log In</span>
              </Button>
            </Link>
          )}
        </div>
      </Collapse>
    </MTNavbar>
    <Dialog open={logoutModal} size="sm" handler={handleLogoutModal}>
      <DialogBody>
        <p>Are you sure you want to logout from Careflow?</p>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          onClick={handleLogoutModal}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="red" onClick={handleLogout}>
          <span>Logout</span>
        </Button>
      </DialogFooter>
    </Dialog>
  </>)
}
