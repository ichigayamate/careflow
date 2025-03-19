import {Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import {useSelector} from "react-redux";

const TABLE_HEAD = ["Name", "Description", "Total Items"];

export default function CMSCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const {token} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCategories = async () => {
      return await backend.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    fetchCategories().then((response) => {
      setItems(response.data.data);
      setLoading(false);
    })
  }, [token])

  return <>
    <div className="flex">
      <div className="flex-1">
        <h1 className="mb-4 text-3xl">Categories</h1>
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
                {item.name}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.description}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.Items.length}
              </Typography>
            </td>
          </tr>
        )
      })
      }
      </tbody>
    </table>
  </>
}
