const Product = require("../models/productModel");
const cloudinary = require("cloudinary");


// Create Product
const createProduct = async(req,res,next) => {
	try{

   if(!req.body){
     return  res.status(400).json({message:"Please enter required fields"});
   }

   let images = [];

   if (typeof req.body.images === "string") {
     images.push(req.body.images);
   } else {
     images = req.body.images;
   }
 
   const imagesLinks = [];
 
   for (let i = 0; i < images.length; i++) {
     const result = await cloudinary.v2.uploader.upload(images[i], {
       folder: "products",
     });
 
     imagesLinks.push({
       public_id: result.public_id,
       url: result.secure_url,
     });
   }
 
   req.body.images = imagesLinks;
   req.body.user = req.user.id;

	const newProduct = await Product.create(req.body);	

    res.status(201).json({
    	success: true,
    	newProduct
    })


	}catch(err){
		res.status(500).json({message: err.message});
	}
}



//Get all products
const getAllProducts = async(req,res) => {

   try{
    
    const resultPerPage = 14;
    const productCount = await Product.countDocuments();


    const queryCopy = { ...req.query};

    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    queryStr = JSON.parse(queryStr);

    if(req.query.keyword){
        queryStr.name = {
          $regex: req.query.keyword,
          $options: "i",
      }
    }

    let filteredProductsCount = await Product.countDocuments(queryStr);

    let products =  Product.find(queryStr).sort({createdAt: -1});

    const currentPage = Number(req.query.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    products = await products.limit(resultPerPage).skip(skip);

   	res.status(200).json({
   		success:true,
   		products,
   		productCount,
      resultPerPage,
      filteredProductsCount
   	})


   }catch(err){
   	  res.status(500).json({message: err.message});
   }

}



//Get product details
const getProductDetails = async(req,res) => {

  try{

  	const productDetails = await Product.findById(req.params.id);

  	if(!productDetails){
  		 return  res.status(404).json({message: "Product not found"});
  	}

  	res.status(200).json({
  		success:true,
  		productDetails
  	});


  }catch(err){
  	 res.status(500).json({message: err.message});
  }

}



//Update Product
const updateProduct = async(req,res) => {

   try{
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });

   }catch(err){
   	  res.status(500).json({message: err.message});
   }

}



//Delete product
const deleteProduct = async(req,res) => {

  try{

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  
    await Product.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });

  }catch(err){
  	res.status(500).json({message: err.message});
  }

}


//Create new review or update the review
const createProductReview = async(req,res) => {

  try{

    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });

  }catch(err){  
   res.status(500).json({message: err.message});
  }

}


//Get all reviews of a product
const getProductReviews = async(req,res) => {

  try{

    const product = await Product.findById(req.query.id);

    if(!product){
        return res.status(404).json({message: "Product not found"});
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews
    });


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


// Get All Product (Admin)
const getAdminProducts = async (req, res, next) => {

  try{
  const products = await Product.find(); 
     
  res.status(200).json({
    success: true,
    products,
  });

}catch(error){
  res.status(500).json(error.message);
}
   
}



module.exports = {createProduct,getAllProducts,getAdminProducts,getProductDetails,deleteProduct,updateProduct,createProductReview,getProductReviews};
