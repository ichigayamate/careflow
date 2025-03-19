import {useEffect, useState} from "react";
import {backend} from "../../../lib/scripts/backend.js";
import {Alert} from "@material-tailwind/react";
import ProductCard from "../../../lib/components/product-card.jsx";
import {useSelector} from "react-redux";


export default function ShopPage() {
  const {isAuthenticated} = useSelector((state) => state.user);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const allItems = async () => {
      return await backend.get("/public/items")
    };

    allItems().then((response) => {
      setItems(response.data.data);
    });
  }, [])

  return (
    <>
      <Alert className="mb-8" color="blue" open={!isAuthenticated}>
        Before making purchase, make sure you are logged in.
      </Alert>
      <div className="grid lg:grid-cols-4 gap-2">
        {items.map((item) => (<ProductCard
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          quantity={item.quantity}
        />))}
      </div>
    </>
  )
}
