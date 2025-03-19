import {Button} from "@material-tailwind/react";
import {Link, Outlet} from "react-router";

export default function CMSLayout() {
  return <>
    <div className="mb-4 rounded-md border border-neutral-500 px-4 py-2 flex gap-2 items-baseline">
      CMS Navigation:
      <Link to="/cms">
        <Button variant="text">Items</Button>
      </Link>

      <Link to="/cms/category">
        <Button variant="text">Categories</Button>
      </Link>

      <Link to="/cms/user">
        <Button variant="text">Users</Button>
      </Link>

      <Link to="/cms/order">
        <Button variant="text">Orders</Button>
      </Link>
    </div>
    <Outlet/>
  </>
}
