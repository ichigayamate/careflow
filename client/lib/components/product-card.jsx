import {Button, Card, CardBody, CardFooter, Typography} from "@material-tailwind/react";
import {Link} from "react-router";
import priceFormatter from "../scripts/priceFormatter.js";
import truncateString from "../scripts/truncate-string.js";

export default function ProductCard({id, name, description, price, quantity}) {
  return <Card>
    <CardBody>
      <Typography variant="h5" color="blue-gray" className="mb-2">
        {name}
      </Typography>
      <Typography>
        {truncateString(description, 100)}
      </Typography>
    </CardBody>
    <CardFooter className="pt-0">
      <Link to={`/shop/product/${id}`}>
        <Button disabled={quantity <= 0}>Buy for {priceFormatter(price)}</Button>
      </Link>
    </CardFooter>
  </Card>
}
