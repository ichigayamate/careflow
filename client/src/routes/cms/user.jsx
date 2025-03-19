import {Button, Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import dayjs from "dayjs";

const TABLE_HEAD = ["Name", "Email", "Date of Birth", "Role", ""];

export default function CMSCategoriesPage() {
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const {user, token} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      return await backend.get("/users/cms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }


    fetchUsers().then((response) => {
      setItems(response.data.data);
      setLoading(false);
    })
  }, [refresh, token]);

  const handleDeleteUser = async (id) => {
    const promise = backend.delete(`/users/cms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setRefresh(refresh + 1);
    });

    await toast.promise(promise, {
      pending: "Deleting user...",
      error: "Failed to delete user.",
    });
  }

  return <>
    <div className="flex">
      <div className="flex-1">
        <h1 className="mb-4 text-3xl">Users</h1>
      </div>
    </div>
    <table className="w-full min-w-max table-auto text-left">
      <thead>
      <tr>
        {TABLE_HEAD.map((head) => (
          <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              {head}
            </Typography>
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {loading ? (
        <tr>
          <td colSpan={TABLE_HEAD.length} className="p-4">
            <Typography
              color="blue-gray"
              className="font-normal leading-relaxed opacity-70"
            >
              Loading...
            </Typography>
          </td>
        </tr>
      ) : items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

        return (
          <tr key={item.id}>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.firstName} {item.lastName}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.email}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {new dayjs(item.dob).format("DD MMM YYYY")}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.role}
              </Typography>
            </td>
            <td className={classes}>
              {user?.id !== item.id && <Button color="red" size="sm" onClick={() => handleDeleteUser(item.id)}>Delete</Button>}
            </td>
          </tr>
        )
      })
      }
      </tbody>
    </table>
  </>
}
