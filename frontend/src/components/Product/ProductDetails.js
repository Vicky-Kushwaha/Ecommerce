import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import ProductCard from "../Home/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  getProduct,
  newReview,
  clearErrors,
} from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import Loading from "../layouts/Loader/Loader";
import ProductReview from "./ProductReview";
import { toast } from "react-toastify";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import Rating from "@mui/material/Rating";
import MetaData from "../layouts/MetaData";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { products } = useSelector((state) => state.products);

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    toast.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = (e) => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    setOpen(false);
    setComment("");
    setRating("");
  };

  const orderHandler = () => {
    const info = {
      image: product.images[0].url,
      name: product.name,
      price: product.price,
      product: product._id,
      quantity: quantity,
      stock: product.stock
    };
    sessionStorage.setItem("singleItem",JSON.stringify(info));
    navigate("/shipping")
  }

  useEffect(() => {

if (product.category) {
      dispatch(getProduct(product.category));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        product._id !== id ? <div className="productDetail_container"></div> : (
          <>
          <MetaData title={`${product.name} -- ECOMMERCE`} />          
            <div className="productDetail_container">
              <div className="carousel">
                <Carousel>
                  {product.images.length >= 1 &&
                    product.images.map((item, index) => (
                      <img src={item.url} alt={product.name} key={index} />
                    ))}
                </Carousel>
              </div>

              <div className="product_details">
                <div className="product_name">
                  <h2>{product.name}</h2>
                  <p className="product_id">
                    <span>Product</span> # {product._id}
                  </p>
                </div>
                <div className="product_rating">
                  <Rating
                    name="half-rating-read"
                    value={product.ratings}
                    readOnly
                    precision={0.5}
                  />
                  <span className="productCardSpan">
                    ({product.numOfReviews} Reviews)
                  </span>
                </div>
                <div className="product_price">
                  <h2>{`₹${product.price}`}</h2>
                </div>
                <div className="addToCart">
                  <div className="inc_dec_item">
                    <button onClick={decreaseQuantity}>-</button>
                    <div>
                      <span>{quantity}</span>
                    </div>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button className="addToCart_btn" onClick={addToCartHandler}>
                    Add to Cart
                  </button>
                </div>
                <div className="status">
                  <div>
                    <span> Status:</span>

                    <p
                      className={product.Stock < 1 ? "redColor" : "greenColor"}
                    >
                      {product.Stock < 1 ? "OutOfStock" : "InStock"}
                    </p>

                    <button className="addToCart_btn" disabled={product.Stock < 1 ? true : false} onClick={orderHandler}>
                    Order Now
                  </button>
                  </div>
                </div>
                <div className="description">
                  <h2>Description</h2>
                  <p>{product.description}</p>
                  <button className="submitReview" onClick={submitReviewToggle}>
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
            {products.length && (
              <>
                <h3 className="categoryHeading">Similar Products</h3>
                <div className="categoryProduct">
                  {products.map((elem) => (
                    <ProductCard key={elem._id} product={elem} />
                  ))}
                </div>
              </>
            )}

{product.reviews[0] &&  (
              <>            
            <div className="review_heading">
              <h1>REVIEWS</h1>
            </div>
                <div className="review_container">
                  {product.reviews &&
                    product.reviews.map((review) => (
                      <ProductReview key={review._id} review={review} />
                    ))}
                </div>
              </>
            )}
          </>
        )
      )}

      {open && (
        <div className="modal_container">
          <div className="modal_box">
            <div className="modal_header">
              <h3>Submit Review</h3>
              <button onClick={submitReviewToggle}>CLOSE</button>
            </div>
            <form onSubmit={reviewSubmitHandler}>
              <div>
                <Rating
                  name="half-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  precision={0.5}
                />
              </div>
              <div>
                <textarea
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="write description here"
                ></textarea>
              </div>
              <div className="submit">
                <button type="submit">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
