import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Option,
  Select, Textarea,
  Typography
} from "@material-tailwind/react";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import {Controller, useForm} from "react-hook-form";
import Input from "../../../lib/components/form/input.jsx";
import priceFormatter from "../../../lib/scripts/priceFormatter.js";
import {useLocation, useNavigate} from "react-router";
import truncateString from "../../../lib/scripts/truncate-string.js";

const TABLE_HEAD = ["Name", "Description", "Category", "Price", "Quantity", ""];

export default function CMSIndexPage() {
  const [refresh, setRefresh] = useState(0);
  const [editMode, setEditMode] = useState(null);
  const {control, handleSubmit, reset, getValues, setValue} = useForm();
  const {token} = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [formLoading, setFormLoading] = useState(false);

  const [formModal, setFormModal] = useState(false);
  const handleFormModal = () => {
    if (formModal) {
      reset();
    }
    setFormModal(!formModal);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      return await backend.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    const fetchItems = async () => {
      return await backend.get("/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    fetchCategories().then((response) => {
      setAllCategories(response.data.data);
    })

    fetchItems().then((response) => {
      setItems(response.data.data);
      setLoading(false);
    });
  }, [refresh, token]);

  const handleGenerateDescription = async () => {
    setFormLoading(true);
    const name = getValues("name");
    const response = await backend.post("/items/generate-description", {
      question: name,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setValue("description", response.data.data);
    setFormLoading(false);
  }

  const handleItemSubmit = async (data) => {
    data.prescription = false;

    if (!editMode) {
      await backend.post("/items", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        handleFormModal();
        setRefresh(refresh + 1);
      })
    } else {
      await backend.put(`/items/${editMode}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        setEditMode(null);
        handleFormModal();
        setRefresh(refresh + 1);
      });
    }
  }

  const handleEdit = (data) => {
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });

    setValue("category", data.Category.id);

    setEditMode(data.id);
    handleFormModal();
  }

  const handleDelete = async (id) => {
    await backend.delete(`/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setRefresh(refresh + 1);
    })
  }

  return <>
    <div className="flex">
      <div className="flex-1">
        <h1 className="mb-4 text-3xl">Items</h1>
      </div>
      <div>
        <Button onClick={handleFormModal}>Add Item</Button>
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
                {truncateString(item.description, 50)}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.Category.name}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {priceFormatter(item.price)}
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {item.quantity}
              </Typography>
            </td>
            <td>
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="sm" color="red" onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </td>
          </tr>
        )
      })
      }
      </tbody>
    </table>

    <Dialog
      open={formModal}
      handler={handleFormModal}
    >
      <form onSubmit={handleSubmit(handleItemSubmit)}>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input control={control} name="name" label="Product Name" required/>
            <Controller rules={{
              required: true,
            }} control={control} name="description" render={({field}) => (
              <div className="flex flex-col">
                <Textarea value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Description"
                          required/>
                <Button disabled={formLoading} type="button" variant="text" size="sm" onClick={handleGenerateDescription}>Generate product description (Beta)</Button>
              </div>
            )}/>
            <Controller rules={{
              required: true,
            }} control={control} name="category" render={({field}) => (
              <Select
                label="Select category"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.error}
                required
              >
                {allCategories.map((category) => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            )}/>
            <div className="relative flex w-full">
              <div className="h-10 w-12 shrink-0 rounded-r-none rounded-l-md flex items-center border border-r-0 border-blue-gray-200 bg-transparent px-3">
                Rp
              </div>
              <Input
                control={control}
                name="price"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="100000"
                className="rounded-l-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100  focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
              />
            </div>
            <Input control={control} pattern="[0-9]*" name="quantity" label="Quantity" required />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="submit" loading={formLoading}>{editMode ? "Edit" : "Add"} Item</Button>
        </DialogFooter>
      </form>
    </Dialog>
  </>
}
