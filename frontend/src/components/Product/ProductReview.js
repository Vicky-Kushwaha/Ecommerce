import "./ProductReview.css";
import Rating from '@mui/material/Rating';

const ProductReview = ({review}) => {


	return(
       <>

                   <div className="review">
                       <div className="profile">
                          <img src="/Profile.png" alt="profile_pic"/>
                       </div>
                       <div className="review_name">
                          <h2>{review.name}</h2>
                       </div>
                       <div className="rating">
                       <Rating name="half-rating-read" value={review.rating} readOnly size="small" precision={0.5}/>
                       </div>
                       <div className="review_description">
                          <p>{review.comment}</p>
                       </div>
                      </div>

       </>
		)
}


export default ProductReview;