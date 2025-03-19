import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import priceFormatter from "../../../lib/scripts/priceFormatter.js";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody, DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography
} from "@material-tailwind/react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

function ProductLoading() {
  return <>
    <div className="w-full lg:w-8/12">
      <Typography variant="h3" className="mb-4">
        <Typography
          as="div"
          variant="h3"
          className="mb-4 h-6 w-56 rounded-full bg-gray-600 animate-pulse"
        >
          &nbsp;
        </Typography>
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-3 w-full rounded-full bg-gray-300 animate-pulse"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-3 w-full rounded-full bg-gray-300 animate-pulse"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-3 w-64 rounded-full bg-gray-300 animate-pulse"
      >
        &nbsp;
      </Typography>
    </div>
    <div className="w-full lg:w-4/12">
      <Card>
        <CardBody>
          <Typography color="gray" className="mb-2 h-3 w-full rounded-full bg-gray-500 animate-pulse">
            &nbsp;
          </Typography>
        </CardBody>
      </Card>
    </div>
  </>
}

export default function ProductsPage() {
  const {id,} = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [buyButton, setBuyButton] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const {token} = useSelector((state) => state.user);
  const navigation = useNavigate();

  const [successModal, setSuccessModal] = useState(false);
  const handleSuccessModal = () => {
    setSuccessModal(!successModal);
    if (successModal) {
      navigation('/shop');
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      return await backend.get(`/public/items/${id}`)
    };

    getProduct().then((response) => {
      setProduct(response.data.data);
      setLoading(false);
    });
  }, [id]);

  const handleBuy = async () => {
    setBuyButton(true);
    const reqObj = {
      itemId: product.id,
      quantity
    }
    await backend.post('/public/items/midtrans', reqObj, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      const midtransToken = res.data.data.token;
      window.snap.pay(midtransToken, {
        onSuccess: async (result) => {
          const {order_id: midtransId} = result;
          await backend.post('/public/items/buy', {
            ...reqObj,
            midtransId
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }).then(() => {
            toast.success("Transaction success");
            setSuccessModal(true);
          });
        },
        onError: function () {
          toast.warn("Transaction failed");
        },
        onClose: function () {
          toast.info("Transaction canceled");
        }
      });
    }).catch((e) => {
      console.error(e);
      toast.error("Transaction failed");
    }).finally(() => {
      setBuyButton(false);
    });
  }

  return <>
    <div className="flex flex-col lg:flex-row justify-center gap-8">
      {loading ? <ProductLoading/> : <>
        <div className="w-full lg:w-8/12">
          <Typography variant="h1" className="mb-1 text-3xl">
            {product.name}
          </Typography>
          <Card className="mb-4">
            <CardBody>
              <p>Category: {product.Category.name}</p>
              <p>Stock: {product.quantity}</p>
            </CardBody>
          </Card>
          <p>{product.description}</p>
        </div>
        <div className="w-full lg:w-4/12">
          <Card>
            <CardBody>
              <Typography color="gray" className="font-medium text-xl mb-4">{priceFormatter(product.price)} /
                pcs</Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-bold"
              >
                Select Amount (In stock: {product.quantity})
              </Typography>
              <div className="relative w-full mb-4">
                <Input
                  type="number"
                  value={quantity}
                  max={product.quantity}
                  min={1}
                  onChange={(e) => (Number(e.target.value) <= product.quantity && Number(e.target.value) > 0) && setQuantity(Number(e.target.value))}
                  onBlur={(e) => (Number(e.target.value) < 1) && setQuantity(1)}
                  className="!border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100  focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <div className="absolute right-1 top-1 flex gap-0.5">
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={() => setQuantity((cur) => (cur === 1 ? 1 : cur - 1))}
                    disabled={quantity === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"/>
                    </svg>
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={() => setQuantity((cur) => (cur === product.quantity ? product.quantity : cur + 1))}
                    disabled={quantity === product.quantity}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"/>
                    </svg>
                  </IconButton>
                </div>
              </div>
              <hr/>
              <Typography
                color="blue-gray"
                className="my-4 font-bold text-xl">
                Total: {priceFormatter(product.price * quantity)}
              </Typography>
              <Button fullWidth disabled={buyButton} onClick={handleBuy}>Buy now</Button>
            </CardBody>
          </Card>
        </div>
      </>
      }
    </div>

    <Dialog open={successModal} handler={handleSuccessModal}>
      <DialogHeader>
        Transaction Success
      </DialogHeader>
      <DialogBody>
        <p>You will be informed to your email about your transcation</p>
      </DialogBody>
      <DialogFooter>
        <Link to="/shop">
          <Button variant="gradient" color="green">
            <span>Back to shop</span>
          </Button>
        </Link>
      </DialogFooter>
    </Dialog>
  </>
}
