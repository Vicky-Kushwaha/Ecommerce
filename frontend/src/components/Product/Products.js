import "./Product.css";
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { useParams } from 'react-router-dom';
import Loading from "../layouts/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { getProduct, clearErrors } from "../../actions/productAction";
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Pagination from '@mui/material/Pagination';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MetaData from "../layouts/MetaData";

const Products = () => {

  const {keyword} = useParams();
  const dispatch = useDispatch();
 
  const [maxPrice, setMaxPrice] = useState(150000);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 150000]);
  const [model,setModel] = useState(false);

  const [rating, setRating] = useState(0);

  const { 
    products,
    loading,
    error,
    resultPerPage,
    filteredProductsCount, } = useSelector((state) => state.products);

  // marks for rating slider
    const marks = [
      {
        value: 0,
        label: '0',
      },
      {
        value: 1,
        label: '1',
      },
      {
        value: 2,
        label: '2',
      },
      {
        value: 3,
        label: '3',
      },
      {
        value: 4,
        label: '4',
      },
      {
        value: 5,
        label: '5',
      },
    ];

 
    const count = Math.ceil(filteredProductsCount/resultPerPage);

   const setCurrentPageNo = (event, value) => {
    setCurrentPage(value);
  };

  const priceHandler = (event,newPrice) => {
    setPrice(newPrice);
  }; 


  const onMaxPriceChange = (event) => {

   if(event.target.value > -1){
    setMaxPrice(event.target.value);
   }

  }

  useEffect(() => {
    
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct( keyword, currentPage, price, rating));
  }, [dispatch, keyword, currentPage, price, rating, error]);

	return(
      <>
        {loading ? <Loading /> : <>

       <div className="Products_container">
       <MetaData title="PRODUCTS -- ECOMMERCE" />        
              <div className="products_heading">
              <h2>Products</h2>
                <div className="filter" onClick={()=> setModel(true)}>
                   <FilterListOutlinedIcon/>
                   <p>Filter</p>
                 </div>
               </div>
              <div className="products">
                 {products && products.map((elem)=>(
                    <ProductCard key={elem._id} product={elem} />
                 	))
                 }
              </div>
        </div>

        <div className="pageButton"><Pagination count={count} page={currentPage} onChange={setCurrentPageNo} /> </div>

</>}        
          
{ model && 
   <div className="filter_container">
       <div className="filter_box">
       <div className="modal_header">
              <h3>Filter</h3>
              <button onClick={()=> setModel(false)} >CLOSE</button>
            </div>        

            <div className="slider">
            <Typography id="price_typo" gutterBottom>
           Price:
            </Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={maxPrice}

            />
            <div className="maxPrice">
            <span>Maximum Price :</span>  
            <input type="number" placeholder="maximum price" value={maxPrice} onChange={onMaxPriceChange}></input>
            </div>
            </div>

      
             <div className="slider">
             <Typography id="rating_typo">Ratings:</Typography>
              <Slider
                value={rating}
                onChange={(e, newRating) => {
                  setRating(newRating);
                }}
                aria-label="Restricted values"
                valueLabelDisplay="auto"
                min={0}
                max={5}
                marks={marks}
              />
             </div>
          </div> 
          </div> }

      </>
		);
}


export default Products;