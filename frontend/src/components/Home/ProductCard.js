import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

const ProductCard = ({ product }) => {
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img
        src={product.images.length >= 1 ? product.images[0].url : ""}
        alt={product.name}
        loading="lazy"
      />
      <p>{product.name}</p>
      <div>
        <Rating
          name="half-rating-read"
          value={product.ratings}
          readOnly
          size="small"
          precision={0.5}
        />
        <span className="productCardSpan">
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
