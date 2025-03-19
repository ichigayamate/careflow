import {Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import {useSelector} from "react-redux";
import priceFormatter from "../../../lib/scripts/priceFormatter.js";
import Input from "../../../lib/components/form/input.jsx";
import {toast} from "react-toastify";

const TABLE_HEAD = ["No", "Name", "Ordered Item", "Quantity", "Total Price", "Midtrans ID", ""];

export default function CMSOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const {token} = useSelector((state) => state.user);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const handleDeleteModal = () => setDeleteModal(!deleteModal);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const getAllOrders = async () => {
      return await backend.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    getAllOrders().then((response) => {
      setItems(response.data.data);
      setLoading(false);
    })
  }, [token]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await backend.delete(`/orders/${confirmDelete}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setItems(items.filter((item) => item.id !== confirmDelete));
      setConfirmDelete(null);
      handleDeleteModal();
    }).catch((e) => {
      toast.error("Failed to cancel order");
    }).finally(() => {
      setDeleteLoading(false)
    });
  }

  return <>
    <div className="flex">
      <div className="flex-1">
        <h1 className="mb-4 text-3xl">Orders</h1>
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
                {idx + 1}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.User.firstName} {item.User.lastName}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.Items[0].name}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.Items[0].OrderItems.quantity}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {priceFormatter(item.Items[0].OrderItems.quantity * item.Items[0].price)}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.midtransId}
              </Typography>
            </td>
            <td className={classes}>
              <Button color="red" size="sm" onClick={() => {
                setConfirmDelete(item.id);
                handleDeleteModal();
              }}>Cancel order</Button>
            </td>
          </tr>
        )
      })
      }
      </tbody>
    </table>

    <Dialog open={deleteModal} handler={handleDeleteModal}>
      <DialogHeader>Cancel order?</DialogHeader>
      <DialogBody>
        <p className="mb-2">Make sure to refund user money on midtrans before cancel this order </p>
      </DialogBody>
      <DialogFooter className="flex gap-2">
        <Button onClick={handleDeleteModal} variant="text">
          <span>Cancel</span>
        </Button>
        <Button color="red" loading={deleteLoading} onClick={handleDelete}>
          <span>Confirm deletion</span>
        </Button>
      </DialogFooter>
    </Dialog>
  </>
}
