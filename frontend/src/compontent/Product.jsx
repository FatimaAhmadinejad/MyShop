import {Card} from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
const Product = ({product}) =>  {
  return (
    <Card className="my-3 p-3 rounded product-card">
        <Link to={`/Product/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="product-img"/>
        </Link>

        <Card.Body>
        <Link to={`/Product/${product._id}`}>
        <Card.Title as="div">
            <strong>{product.name}</strong>
        </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating value={product.rating || 0} text={`${product.numReviews || 0}reviews`}/>
        </Card.Text>
        <Card.Text as="h3">
            ${product.price}
        </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product