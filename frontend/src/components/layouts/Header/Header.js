import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountMenu from "./userOption";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import axios from "axios";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [recommendData, setRecommendData] = useState("");
  const [recommend, setRecommend] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const navigate = useNavigate();
  const input = useRef();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  window.addEventListener("click", (event) => {
    if (
      event.target.className !== input.current.className &&
      event.target.className !== "searchRecommend"
    ) {
      setRecommend(false);
      setKeyword("");
    }
  });

  const uniqueElement = (array) => {
    const data = array.map((elem) => {
      return elem.name;
    });

    return [...new Set(data)];
  };

  const onInputClick = async () => {
    try {
      const { data } = await axios.get(
        `/api/auth/products?page=1&price[gte]=0&price[lte]=250000&ratings[gte]=0`
      );

      setRecommendData(uniqueElement(data.products));
      setRecommend(true);
    } catch (err) {
      return err;
    }
  };

  const handleChange = async (e) => {
    setKeyword(e.target.value);

    try {
      const { data } = await axios.get(
        `/api/auth/products?keyword=${keyword}&page=1&price[gte]=0&price[lte]=250000&ratings[gte]=0`
      );

      setRecommendData(uniqueElement(data.products));
    } catch (err) {
      return err;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && currentIndex < recommendData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (event.key === "ArrowUp" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (
      event.key === "Enter" &&
      currentIndex <= recommendData.length - 1 &&
      currentIndex > -1
    ) {
      navigate(`/products/${recommendData[currentIndex]}`);
      setRecommend(false);
      setCurrentIndex(-1);
      setKeyword("");
    }
  };

  const handleRecommendSearch = (name) => {
    navigate(`/products/${name}`);
    setRecommend(false);
    setKeyword("");
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } 
    setRecommend(false);
    setKeyword("");
    input.current.blur();
  };

  return (
    <>
      <div className="navbar">
        <div className="nav_left">
          <Link to="/">
            <span className="heading">Ecommerce</span>
          </Link>
        </div>
        <div className="nav_mid">
          <form onSubmit={searchSubmitHandler}>
            <label htmlFor="search" className="search_label">
              <SearchIcon />
            </label>
            <input
              className="search_input"
              id="search"
              type="text"
              placeholder="search product by name"
              onChange={handleChange}
              value={keyword}
              autoComplete="off"
              onClick={onInputClick}
              onKeyDown={handleKeyDown}
              ref={input}
            />
            {recommend && (
              <div className="searchRecommend">
                {recommendData &&
                  recommendData.map((elem, index) => (
                   index <= 9 && (<p
                      className={
                        index === currentIndex ? "recommendActive" : ""
                      }
                      onClick={() => handleRecommendSearch(elem)}
                      key={index}
                    >
                      {elem}
                    </p>)
                  ))}
              </div>
            )}
          </form>
        </div>
        <div className="nav_right">
          <Link to="/cart">
            <div className="icon_container">
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartOutlinedIcon />
              </Badge>

              <p>Cart</p>
            </div>
          </Link>
          {isAuthenticated ? (
            <div className="myProfile">
              <AccountMenu user={user} />
            </div>
          ) : (
            <Link to="/login">
              <div className="icon_container">
                <AccountCircleOutlinedIcon />
                <p>Login</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
