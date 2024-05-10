import "./Home.css";
import { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layouts/Loader/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import MetaData from "../layouts/MetaData";

const categories = [
  "All",
  "Laptop",
  "SmartPhones",
  "Footwear",
  "Furniture",
  "Fashion",
  "Appliances",
  "Camera",
];

const images = [
  "images/all.jpg",
  "images/laptops.jpg",
  "images/mobile.jpg",
  "images/shoes.jpg",
  "images/furnitures.jpg",
  "images/fashions.jpg",
  "images/appliances.jpg",
  "images/camera.jpg",
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct());
  }, [dispatch, error, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="ECOMMERCE" />
          <div className="categoryBox">
            {categories.map((category, index) => (
              <div
                className="category-link"
                key={category}
                onClick={() => navigate(`/products/${category}`) }
              >
                {images && <img src={`${images[index]}`} alt="pic" />}
                <p>{category}</p>
              </div>
            ))}
          </div>
          <div className="home_container">
            <div className="banner">
              <Carousel
                indicatorContainerProps={{
                  style: {
                    zIndex: 1,
                    marginTop: "-33px",
                    position: "relative",
                    paddingBottom: "10px"
                  },
                }}
              >
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcSet="images/banner6.jpg"
                  />
                  <img src="images/banner1.webp" alt="banner1" />
                </picture>
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcSet="images/banner7.png"
                  />
                  <img src="images/banner2.webp" alt="banner2" />
                </picture>
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcSet="images/banner8.png"
                  />
                  <img src="images/banner3.webp" alt="banner3" />
                </picture>
                <picture>
                  <source
                    media="(max-width: 600px)"
                    srcSet="images/banner9.png"
                  />
                  <img src="images/banner4.webp" alt="banner4" />
                </picture>
              </Carousel>
            </div>
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="container">
              {products &&
                products.map((elem) => (
                  <ProductCard key={elem._id} product={elem} />
                ))}
            </div>{" "}
          </div>{" "}
        </>
      )}
    </>
  );
};

export default Home;
